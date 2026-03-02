import { ClipboardList } from "lucide-react"
export const historiaForm = {
  view: "historia",
  title: "Historias Clínicas",
  icon: ClipboardList,
  fields: [
    { id: "id_mascota", label: "Mascota - Dueño", type: "combobox", searchable: true },
    { id: "id_motivo", label: "Motivo historia", type: "combobox", searchable: true },
    { id: "fecha", label: "Fecha", type: "datetime", required: true },
    { id: "detalle", label: "Detalle", type: "textarea", width: "1/2" },
    { id: "observaciones", label: "Observaciones", type: "textarea", required: false, width: "1/2" },
    { id: "id_estado_historia", label: "Estado", type: "combobox", default: "1" },
  ],
  extended_form: [
    "historia_seguimiento",
    "historia_producto",
    "historia_procedimiento",
    "historia_anamnesis",
    "historia_valoracion",
  ],
}