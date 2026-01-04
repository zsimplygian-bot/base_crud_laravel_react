import { DataTableLayout } from "@/layouts/datatable-layout";
const view = "medicamento";
const title = "Medicamento";
const formFields = {
  fields: [
    { id: "medicamento", label: "Medicamento", required: true },
    { id: "descripcion", label: "Descripción" },
  ],
};
const searchFields = formFields.fields.map(f => ({ ...f }));
export default function DatatablePage() {
  return <DataTableLayout {...{ view, title, formFields, searchFields }} />;
}