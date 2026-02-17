// mascota.config.ts
export const procedimientoForm = {
  view: "procedimiento",
  title: "Procedimiento",
  fields: [
    { id: "procedimiento", label: "Procedimiento", required: true },
    { id: "id_categoria_procedimiento", label: "Categoría", type: "combobox",},
    { id: "descripcion", label: "Descripción" },
    { id: "precio", label: "Precio" },
  ],
}
