import { Stethoscope } from "lucide-react"
export const procedimientoForm = {
  view: "procedimiento",
  title: "Procedimiento",
  icon: Stethoscope,
  fields: [
    { id: "procedimiento", label: "Procedimiento", searchable: true, defaultVisible: true },
    { id: "id_categoria_procedimiento", label: "Categoría", type: "combobox", searchable: true, defaultVisible: true },
    { id: "descripcion", label: "Descripción", searchable: true, required: false },
    { id: "precio", label: "Precio", searchable: true, required: false },
  ],
}
