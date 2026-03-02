import { Syringe } from "lucide-react"
export const historia_productoForm = {
  view: "historia_producto",
  title: "Productos",
  icon: Syringe,
  fields: [
    { id: "id_historia", hidden: true },
    { id: "dosis", label: "Receta" },
    { id: "precio", label: "Precio S/", type: "number", required: false },
    { id: "fecha", label: "Fecha", type: "datetime" },
    { id: "archivo", label: "Imagen", type: "file", required: false },
  ],  
  recordFields: [
    { id: "dosis", label: "Dosis" },
  {
    id: "productos",
    label: "Productos",
    format: "join",
    fields: ["producto", "cantidad", "unidad"],
    template: "{producto} ({cantidad} {unidad})",
    separator: ", ",
  },
  
  { id: "precio", label: "Precio S/" },
],
  extended_form: [
    "historia_producto_dosis",
  ],
}