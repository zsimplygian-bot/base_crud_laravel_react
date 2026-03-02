import { Users } from "lucide-react"
export const clienteForm = {
  view: "cliente",
  title: "Cliente",
  icon: Users,
  fields: [
    { id: "cliente", label: "Cliente", searchable: true, defaultVisible: true },
    { id: "email", label: "Email", searchable: true, required: false },
    { id: "dni", label: "DNI", searchable: true, required: false },
    { id: "telefono", label: "Teléfono", searchable: true },
  ],
}
