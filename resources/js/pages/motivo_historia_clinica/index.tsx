import { DataTableLayout } from "@/layouts/datatable-layout";
const view = "motivo_historia_clinica";
const title = "Motivo Historia Clínica";
const formFields = {
  fields: [
    { id: "motivo_historia_clinica", label: "Motivo historia clínica", required: true },
  ],
};
const searchFields = formFields.fields.map(f => ({ ...f }));
export default function DatatablePage() {
  return <DataTableLayout {...{ view, title, formFields, searchFields }} />;
}
