import { Syringe } from "lucide-react"
export const productoForm = {
  view: "producto",
  title: "Producto",
  icon: Syringe,
  fields: [
    { id: "producto", label: "Producto", searchable: true, defaultVisible: true },
    { id: "id_categoria_producto", label: "Categoría", type: "combobox", searchable: true, defaultVisible: true },
    { id: "descripcion", label: "Descripción", searchable: true, required: false },
    { id: "precio", label: "Precio", searchable: true, required: false },
  ],
}
