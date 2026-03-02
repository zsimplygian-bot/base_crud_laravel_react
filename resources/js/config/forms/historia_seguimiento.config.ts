import { ClipboardList } from "lucide-react"
export const historia_seguimientoForm = {
  view: "historia_seguimiento",
  title: "Seguimiento",
  icon: ClipboardList,
  fields: [
    { id: "id_historia", hidden: true },
    { id: "detalle", label: "Detalle", type: "textarea" },
    { id: "observaciones", label: "Observaciones", required: false },
    { id: "fecha", label: "Fecha", type: "datetime" },
    { id: "archivo", label: "Imagen", type: "file", required: false },
  ],
  recordFields: [
    { id: "detalle", label: "Detalle" },
    { id: "observaciones", label: "Observaciones" },
  ],
}