// mascota.config.ts
export const procedimientoForm = {
  view: "procedimiento",
  title: "Procedimiento",
  fields: [
    { id: "procedimiento", label: "Procedimiento", searchable: true, defaultVisible: true },
    { id: "id_categoria_procedimiento", label: "Categoría", type: "combobox", searchable: true, defaultVisible: true },
    { id: "descripcion", label: "Descripción", searchable: true },
    { id: "precio", label: "Precio", searchable: true },
  ],
}
