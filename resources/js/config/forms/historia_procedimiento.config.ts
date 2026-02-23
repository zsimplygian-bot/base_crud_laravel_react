import { Stethoscope } from "lucide-react"
export const historia_procedimientoForm = {
  title: "Procedimientos",
  view: "historia_procedimiento",
  icon: Stethoscope,
  fields: [
    { id: "id_historia", hidden: true },
    { id: "id_procedimiento", label: "Procedimiento", type: "combobox" },
    { id: "detalle", label: "Detalle" },
    { id: "precio", label: "Precio S/", type: "number" },
    { id: "fecha", label: "Fecha", type: "datetime" },
    { id: "archivo", label: "Imagen", type: "file" },
  ],

  recordFields: [
    { id: "nombre_procedimiento", label: "Procedimiento" },
    { id: "detalle", label: "Detalle" },
    { id: "precio", label: "Precio S/" },
  ],
}