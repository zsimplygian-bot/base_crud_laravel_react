import { DataTableLayout } from "@/layouts/datatable-layout";
const view = "user";
const title = "Usuarios";
const formFields = {
  fields: [
    { id: "name", label: "Usuario", required: true },
    { id: "id_rol", label: "Rol", type: "combobox", required: true },
    { id: "email", label: "Email", required: true },
    { id: "archivo", label: "Imagen", type: "file" },
  ],
};
const searchFields = formFields.fields.map(f => ({ ...f }));
export default function DatatablePage() {
  return <DataTableLayout {...{ view, title, formFields, searchFields }} />;
}
