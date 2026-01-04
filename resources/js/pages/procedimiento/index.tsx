import { DataTableLayout } from "@/layouts/datatable-layout";
const view = "procedimiento";
const title = "Procedimiento";
const formFields = {
  fields: [
    { id: "procedimiento", label: "Procedimiento", required: true },
    { id: "descripcion", label: "Descripción" },
  ],
};
const searchFields = formFields.fields.map(f => ({ ...f }));
export default function DatatablePage() {
  return <DataTableLayout {...{ view, title, formFields, searchFields }} />;
}
