import { Tag } from "lucide-react"
export const categoriaProductoView = {
  view: "categoria_producto",
  title: "Categoria producto",
  icon: Tag,
  fields: [
    { id: "categoria_producto", label: "Categoria producto", searchable: true, },
    { id: "emoji_categoria_producto", label: "Emoji", required: false},
  ],
}
