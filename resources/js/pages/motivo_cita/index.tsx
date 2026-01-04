import { DataTableLayout } from "@/layouts/datatable-layout";
const view = "motivo_cita";
const title = "Motivo cita";
const formFields = {
  fields: [
    { id: "motivo_cita", label: "Motivo cita", required: true },
    { id: "lapso_tiempo", label: "Lapso de tiempo" },
  ],
};
const searchFields = formFields.fields.map(f => ({ ...f }));
export default function DatatablePage() {
  return <DataTableLayout {...{ view, title, formFields, searchFields }} />;
}
