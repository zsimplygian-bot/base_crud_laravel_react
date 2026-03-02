import { PawPrint } from "lucide-react"
export const razaForm = {
  view: "raza",
  title: "Raza",
  icon: PawPrint,
  fields: [
    { id: "id_especie", label: "Especie", type: "combobox", searchable: true, defaultVisible: true},
    { id: "raza", label: "Raza", searchable: true, defaultVisible: true, required: false },
  ],
}
