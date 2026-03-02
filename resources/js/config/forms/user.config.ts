import { User } from "lucide-react"
export const userForm = {
  view: "user",
  title: "Usuario",
  icon: User,
  fields: [
    { id: "name", label: "Usuario", searchable: true, defaultVisible: true },
    { id: "id_rol", label: "Rol", type: "combobox", searchable: true, defaultVisible: true },
    { id: "email", label: "Email", searchable: true, },
    { id: "archivo", label: "Imagen", type: "file", required: false },
  ],
}
