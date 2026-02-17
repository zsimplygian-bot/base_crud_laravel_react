// mascota.config.ts
export const clienteForm = {
  view: "cliente",
  title: "Cliente",
  fields: [
    { id: "cliente", label: "Cliente", searchable: true, defaultVisible: true },
    { id: "email", label: "Email", searchable: true },
    { id: "telefono", label: "Teléfono", searchable: true },
  ],
}
