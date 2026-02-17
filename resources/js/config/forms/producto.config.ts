// mascota.config.ts
export const productoForm = {
  view: "producto",
  title: "Producto",
  fields: [
    { id: "producto", label: "Producto", required: true },
    { id: "id_categoria_producto", label: "Categoría", type: "combobox",},
    { id: "descripcion", label: "Descripción" },
    { id: "precio", label: "Precio" },
  ],
}
