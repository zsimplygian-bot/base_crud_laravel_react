// pages/categoria/index.tsx
import { DataTableLayout } from "@/layouts/datatable-layout";
const view = "categoria_procedimiento";
const title = "Categoria Procedimiento";
const formFields = {
  fields: [
    { id: "categoria_procedimiento", label: "Categoria procedimiento", required: true },
    { id: "emoji_categoria_procedimiento", label: "Emoji", required: true },
  ],
};
const searchFields = formFields.fields.map(f => ({
  ...f, defaultVisible: [ "categoria_procedimiento" ].includes(f.id),
}));
export default function DatatablePage() {
  return <DataTableLayout {...{ view, title, formFields, searchFields, width:"1/3" }} />;
}
