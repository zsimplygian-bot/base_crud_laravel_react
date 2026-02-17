// mascota.config.ts
export const userForm = {
  view: "user",
  title: "Usuario",
  fields: [
    { id: "name", label: "Usuario", searchable: true, defaultVisible: true },
    { id: "id_rol", label: "Rol", type: "combobox", searchable: true, defaultVisible: true },
    { id: "email", label: "Email", searchable: true, required: true },
    { id: "archivo", label: "Imagen", type: "file" },
  ],
}
