// mascota.config.ts
export const productoForm = {
  view: "producto",
  title: "Producto",
  fields: [
    { id: "producto", label: "Producto", searchable: true, defaultVisible: true },
    { id: "id_categoria_producto", label: "Categoría", type: "combobox", searchable: true, defaultVisible: true },
    { id: "descripcion", label: "Descripción", searchable: true },
    { id: "precio", label: "Precio", searchable: true },
  ],
}
