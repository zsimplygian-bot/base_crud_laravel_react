import { useState } from "react"
import { DataTableLayout } from "@/layouts/datatable-layout"
import { VIEW_CONFIG } from "@/config/views"
import { router } from "@inertiajs/react"
import { toast } from "sonner"
import axios from "axios" // Importante: usa axios para recibir datos JSON

const { view, title, icon } = VIEW_CONFIG.rfm

export default function DatatablePage() {
  const [isPredicting, setIsPredicting] = useState(false);

  // 1. Procesar Histórico (Mantiene Inertia porque es un cambio de estado global/BD)
  const handleProcessRFM = () => {
    router.post('/api/rfm/procesar', {}, {
      onStart: () => toast.loading("Procesando actividad clínica..."),
      onFinish: () => toast.dismiss(),
      onSuccess: () => toast.success("Análisis RFM actualizado correctamente"),
      onError: () => toast.error("Error al procesar la data de historias"),
      preserveScroll: true,
    });
  };

  // 2. Predicción con IA (Optimizado con Axios y Async/Await)
  const handlePredictRFM = async () => {
    const fechaDestino = window.prompt("Ingresa la fecha para predecir el comportamiento (AAAA-MM-DD):", "2026-12-31");
    if (!fechaDestino) return;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaDestino)) {
      toast.error("Formato de fecha no válido. Use AAAA-MM-DD");
      return;
    }

    const toastId = toast.loading(`Conectando con el modelo de IA para el ${fechaDestino}...`);
    setIsPredicting(true);

    try {
      // Usamos axios.post para asegurar la espera síncrona de la respuesta
      const response = await axios.post('/api/rfm/predecir', { 
        fecha_destino: fechaDestino 
      });

      if (response.data.success) {
        toast.success("Proyección completada exitosamente", { id: toastId });
        
        // OPCIONAL: Si Laravel guardó los datos en BD, le decimos a Inertia 
        // que refresque los datos de la tabla sin recargar la página entera
        router.reload({ only: ['clientes', 'rfm_data'] }); 
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.error || "Error al conectar con el servidor Flask/IA";
      toast.error(msg, { id: toastId });
    } finally {
      setIsPredicting(false);
      toast.dismiss(toastId);
    }
  };

  return (
    <DataTableLayout 
      {...{ view, title, icon }} 
      showRFM={true} 
      onProcessRFM={handleProcessRFM}
      onPredictRFM={handlePredictRFM}
      isProcessing={isPredicting} // Podrías usar esto para deshabilitar botones
    />
  );
}