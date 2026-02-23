import { ClipboardList } from "lucide-react"
export const motivoForm = {
  view: "motivo",
  title: "Motivo",
  icon: ClipboardList,
  fields: [
    { id: "motivo", label: "Motivo", searchable: true, defaultVisible: true },
    { id: "emoji_motivo", label: "Emoji motivo" },
  ],
}
