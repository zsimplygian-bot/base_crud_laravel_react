import { useState } from "react";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import axios from "axios";
import { PlayIcon, TrendingUpIcon } from "lucide-react";
import { SmartButton } from "@/components/smart-button";

/**
 * Hook para manejar la lógica de negocio del módulo RFM.
 */
export const useRFMLogic = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const processRFM = () => {
    router.post('/api/rfm/procesar', {}, {
      onStart: () => toast.loading("Recalculando métricas de clientes..."),
      onFinish: () => toast.dismiss(),
      onSuccess: () => toast.success("Análisis RFM actualizado exitosamente"),
      onError: () => toast.error("Error al procesar la data de historias clínicas"),
      preserveScroll: true,
    });
  };

  const predictRFM = async () => {
    const fechaDestino = window.prompt(
      "Ingresa la fecha para la proyección (Formato AAAA-MM-DD):", 
      "2026-12-31"
    );

    if (!fechaDestino) return;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaDestino)) {
      toast.error("Formato de fecha no válido. Use AAAA-MM-DD");
      return;
    }

    const toastId = toast.loading(`Ejecutando modelo predictivo para el ${fechaDestino}...`);
    setIsProcessing(true);

    try {
      const response = await axios.post('/api/rfm/predecir', { 
        fecha_destino: fechaDestino 
      });

      if (response.data.success) {
        toast.success("Proyección completada y guardada en BD", { id: toastId });
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

  return { processRFM, predictRFM, isProcessing };
};

/**
 * Componente de Botones para la Toolbar RFM
 */
export const RFMButtons = () => {
  const { processRFM, predictRFM, isProcessing } = useRFMLogic();

  return (
    <div className="flex gap-2">
      <SmartButton 
        {...{ 
          buttonColor: "green", 
          icons: PlayIcon,
          variant: "default",
          tooltip: "Recalcular RFM Actual",
          confirmation: { 
            title: "Confirmar Procesamiento", 
            description: "¿Deseas recalcular la segmentación RFM con la actividad de historias clínicas?" 
          },
          onClick: processRFM 
        }}
      />

      <SmartButton 
        {...{ 
          buttonColor: "blue", 
          icons: TrendingUpIcon,
          variant: "default",
          tooltip: "Proyectar con IA",
          disabled: isProcessing,
          onClick: predictRFM 
        }}
      />
    </div>
  );
};