import { DataTableLayout } from "@/layouts/datatable-layout";
const view = "producto";
const title = "Producto";
const formFields = {
  fields: [
    { id: "producto", label: "Producto", required: true },
    { id: "descripcion", label: "Descripción" },
  ],
};
const searchFields = formFields.fields.map(f => ({ ...f }));
export default function DatatablePage() {
  return <DataTableLayout {...{ view, title, formFields, searchFields }} />;
}