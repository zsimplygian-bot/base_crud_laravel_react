// mascota.config.ts
export const mascotaForm = {
  view: "mascota",
  title: "Mascota",
  fields: [
    { id: "mascota", label: "Mascota", required: true, searchable: true, defaultVisible: true },
    { id: "id_cliente", label: "Cliente", type: "combobox", searchable: true, defaultVisible: true },
    { id: "id_raza", label: "Raza", type: "combobox", searchable: true, defaultVisible: true },
    { id: "id_sexo", label: "Sexo", type: "combobox", searchable: true, defaultVisible: true },
    { id: "id_estado_mascota", label: "Estado mascota", type: "combobox", searchable: true },
    { id: "edad", label: "Edad" },
    { id: "color", label: "Color" },
    { id: "peso", label: "Peso" },
    { id: "observaciones", label: "Observaciones", type: "textarea" },
    { id: "archivo", label: "Imagen", type: "file" },
  ],
}