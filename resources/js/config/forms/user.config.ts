// mascota.config.ts
export const userForm = {
  view: "user",
  title: "Usuario",
  fields: [
    { id: "name", label: "Usuario", required: true },
    { id: "id_rol", label: "Rol", type: "combobox", required: true },
    { id: "email", label: "Email", required: true },
    { id: "archivo", label: "Imagen", type: "file" },
  ],
}
