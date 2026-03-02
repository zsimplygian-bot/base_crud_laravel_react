import { Tag } from "lucide-react"
export const categoriaProcedimientoForm = {
  view: "categoria_procedimiento",
  title: "Categoria procedimiento",
  icon: Tag,
  fields: [
    { id: "categoria_procedimiento", label: "Categoria procedimiento", searchable: true, },
    { id: "emoji_categoria_procedimiento", label: "Emoji", required: false},
  ],
}
