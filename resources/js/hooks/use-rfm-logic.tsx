import { useState } from "react";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import axios from "axios";

/**
 * Hook para manejar la lógica de negocio del módulo RFM.
 * Centraliza la comunicación con Laravel (Backend) y Flask (IA).
 */
export const useRFMLogic = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  // 1. Lógica para recalcular el RFM base en la BD (Laravel)
  const processRFM = () => {
    router.post('/api/rfm/procesar', {}, {
      onStart: () => toast.loading("Recalculando métricas de clientes..."),
      onFinish: () => toast.dismiss(),
      onSuccess: () => toast.success("Análisis RFM actualizado exitosamente"),
      onError: () => toast.error("Error al procesar la data de historias clínicas"),
      preserveScroll: true,
    });
  };

  // 2. Lógica para la proyección con IA (Flask)
  const predictRFM = async () => {
    const fechaDestino = window.prompt(
      "Ingresa la fecha para la proyección (Formato AAAA-MM-DD):", 
      "2026-12-31"
    );

    // Validación de formato simple
    if (!fechaDestino) return;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaDestino)) {
      toast.error("Formato de fecha no válido. Use AAAA-MM-DD");
      return;
    }

    const toastId = toast.loading(`Ejecutando modelo predictivo para el ${fechaDestino}...`);
    setIsProcessing(true);

    try {
      // Llamada al endpoint de predicción
      const response = await axios.post('/api/rfm/predecir', { 
        fecha_destino: fechaDestino 
      });

      if (response.data.success) {
        toast.success("Proyección completada y guardada en BD", { id: toastId });
        
        // Refrescar los datos en la tabla sin recargar la página
        router.reload({ only: ['rfm_data'] });
      }
    } catch (error) {
      console.error("Error en IA:", error);
      const msg = error.response?.data?.error || "Error al conectar con el servidor de IA";
      toast.error(msg, { id: toastId });
    } finally {
      setIsProcessing(false);
      toast.dismiss(toastId);
    }
  };

  return { 
    processRFM, 
    predictRFM, 
    isProcessing 
  };
};