import { Syringe } from "lucide-react"
export const historia_producto_dosisForm = {
  view: "historia_producto_dosis",
  title: "Dosis de Productos",
  icon: Syringe,
  fields: [
    { id: "id_historia_producto", hidden: true },
    { id: "id_producto", label: "Producto", type: "combobox" },
    { id: "cantidad", label: "Cantidad" },
    { id: "unidad", label: "Unidad" },
    { id: "via", label: "Via" },
    { id: "frecuencia", label: "Frecuencia" },
    { id: "fecha", label: "Fecha", type: "datetime" },
  ],  
  recordFields: [
    { id: "nombre_producto", label: "Producto" },
    { id: "dosis", label: "Dosis" },
    { id: "precio", label: "Precio S/" },
  ],
}