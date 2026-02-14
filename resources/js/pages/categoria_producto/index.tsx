// pages/categoria/index.tsx
import { DataTableLayout } from "@/layouts/datatable-layout";
const view = "categoria_producto";
const title = "Categoria Producto";
const formFields = {
  fields: [
    { id: "categoria_producto", label: "Categoria producto", required: true },
    { id: "emoji_categoria_producto", label: "Emoji", required: true },
  ],
};
const searchFields = formFields.fields.map(f => ({
  ...f, defaultVisible: [ "categoria_producto" ].includes(f.id),
}));
export default function DatatablePage() {
  return <DataTableLayout {...{ view, title, formFields, searchFields, width:"1/3" }} />;
}
