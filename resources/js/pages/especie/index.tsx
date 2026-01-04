import { DataTableLayout } from "@/layouts/datatable-layout";
const view = "especie";
const title = "Especie";
const formFields = {
  fields: [
    { id: "especie", label: "Especie", required: true },
  ],
};
const searchFields = formFields.fields.map(f => ({ ...f }));
export default function DatatablePage() {
  return <DataTableLayout {...{ view, title, formFields, searchFields }} />;
}