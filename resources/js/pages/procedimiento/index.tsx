import { DataTableLayout } from "@/layouts/datatable-layout";
const view = "procedimiento";
const title = "Procedimiento";
const formFields = {
  fields: [
    { id: "procedimiento", label: "Procedimiento", required: true },
    { id: "id_categoria_procedimiento", label: "Categoría", type: "combobox",},
    { id: "descripcion", label: "Descripción" },
    { id: "precio", label: "Precio" },
  ],
};
const searchFields = formFields.fields.map(f => ({ ...f }));
export default function DatatablePage() {
  return <DataTableLayout {...{ view, title, formFields, searchFields }} />;
}
