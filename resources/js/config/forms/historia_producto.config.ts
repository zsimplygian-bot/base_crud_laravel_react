import { Syringe } from "lucide-react"
export const historia_productoForm = {
  view: "historia_producto",
  title: "Productos",
  icon: Syringe,
  fields: [
    { id: "id_historia", hidden: true },
    { id: "id_producto", label: "Producto", type: "combobox" },
    { id: "dosis", label: "Dosis" },
    { id: "precio", label: "Precio S/", type: "number" },
    { id: "fecha", label: "Fecha", type: "datetime" },
    { id: "archivo", label: "Imagen", type: "file" },
  ],  
  recordFields: [
    { id: "nombre_producto", label: "Producto" },
    { id: "dosis", label: "Dosis" },
    { id: "precio", label: "Precio S/" },
  ],
  extended_form: [
    "historia_producto_dosis",
  ],
}