import { DataTableLayout } from "@/layouts/datatable-layout";
const view = "raza";
const title = "Raza";
const formFields = {
  fields: [
    { id: "id_especie", label: "Especie", type: "combobox", lista: "especie", labelKey: "especie", required: true },
    { id: "raza", label: "Raza", required: true },
  ],
};
const searchFields = formFields.fields.map(f => ({ ...f }));
export default function DatatablePage() {
  return <DataTableLayout {...{ view, title, formFields, searchFields }} />;
}
