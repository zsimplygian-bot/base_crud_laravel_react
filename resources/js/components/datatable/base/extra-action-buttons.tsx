import { FileTextIcon, PlayIcon, TrendingUpIcon } from "lucide-react";
import { router } from "@inertiajs/react";
import axios from "axios";
import { toast } from "sonner";

// Lista de vistas que NO deben mostrar las opciones por defecto (Copiar, Editar, etc)
const VIEWS_WITHOUT_BASE = ["rfm"]; 

export const shouldIgnoreBaseActions = (view) => VIEWS_WITHOUT_BASE.includes(view);

export const getExtraActions = (view, row_id, onSuccess) => {
  const actions = [];

  if (view === "historia") {
    actions.push({ 
      label: "Imprimir", 
      icon: FileTextIcon, 
      color: "text-cyan-500",   
      action: () => window.open(`/historia/pdf/${row_id}`, "_blank") 
    });
  }

  if (view === "rfm") {
    actions.push(
      { 
  label: "Procesar Individual", 
  icon: PlayIcon, 
  color: "text-green-500",
  action: async () => {
    const toastId = toast.loading("Procesando...");
    try {
      await axios.post(`/api/rfm/procesar-individual/${row_id}`);
      toast.success("Procesado con éxito", { id: toastId });
      // Esto refrescará el listado de Inertia
      router.reload({ only: ['rfm_data'] }); 
    } catch (error) {
      toast.error("Error al procesar", { id: toastId });
    }
  }
},
      { 
        label: "Predecir RFM", 
        icon: TrendingUpIcon, 
        color: "text-blue-600",
        action: async () => {
          toast.info("Ejecutando predicción...");
        }
      }
    );
  }

  return actions;
};