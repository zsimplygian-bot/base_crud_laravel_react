import { PawPrint } from "lucide-react"
export const especieForm = {
  view: "especie",
  title: "Especie",
  icon: PawPrint,
  fields: [
    { id: "especie", label: "Especie", searchable: true, defaultVisible: true },
    { id: "emoji_especie", label: "Emoji", required: false },
  ],
}
