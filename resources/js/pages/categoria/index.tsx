// pages/categoria/index.tsx
import { DataTableLayout } from "@/layouts/datatable-layout";
const view = "categoria";
const title = "Categoria";
const formFields = {
  fields: [
    { id: "categoria", label: "Categoria", required: true },
    { id: "emoji", label: "Emoji", required: true },
  ],
};
const searchFields = formFields.fields.map(f => ({
  ...f,
  defaultVisible: [ "categoria",
  ].includes(f.id),
}));
export default function DatatablePage() {
  return ( <DataTableLayout {...{ view, title, formFields, searchFields }} width="1/3"
    />
  );
}