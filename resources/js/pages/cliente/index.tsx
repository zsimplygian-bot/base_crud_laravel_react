import { DataTableLayout } from "@/layouts/datatable-layout";
const view = "cliente";
const title = "Cliente";
const formFields = {
  fields: [
    { id: "cliente", label: "Cliente", required: true },
    { id: "email", label: "Email" },
    { id: "telefono", label: "Teléfono" },
  ],
};
const searchFields = formFields.fields.map(f => ({
  ...f,
  defaultVisible: [ "cliente", "telefono",
  ].includes(f.id),
}));
export default function DatatablePage() {
  return <DataTableLayout {...{ view, title, formFields, searchFields }} />;
}