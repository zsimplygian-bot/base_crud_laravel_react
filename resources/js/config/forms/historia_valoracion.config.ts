import { ThumbsUp } from "lucide-react"
export const historia_valoracionForm = {
  view: "historia_valoracion",
  title: "Valoración",
  icon: ThumbsUp,
  fields: [
    { id: "id_historia", hidden: true },
    { id: "score", label: "Score", type: "textarea" },
    { id: "comentario", label: "Comentario", required: false },
  ],
  recordFields: [
    { id: "score", label: "Score" },
    { id: "comentario", label: "Comentario" },
  ],
}