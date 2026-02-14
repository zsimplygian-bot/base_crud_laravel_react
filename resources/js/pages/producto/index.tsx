import { DataTableLayout } from "@/layouts/datatable-layout";
import { Combobox } from "@headlessui/react";
const view = "producto";
const title = "Producto";
const formFields = {
  fields: [
    { id: "producto", label: "Producto", required: true },
    { id: "id_categoria_producto", label: "Categoría", type: "combobox",},
    { id: "descripcion", label: "Descripción" },
    { id: "precio", label: "Precio" },
  ],
};
const searchFields = formFields.fields.map(f => ({ ...f }));
export default function DatatablePage() {
  return <DataTableLayout {...{ view, title, formFields, searchFields }} />;
}