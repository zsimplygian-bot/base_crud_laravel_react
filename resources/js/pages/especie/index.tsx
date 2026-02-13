import { DataTableLayout } from "@/layouts/datatable-layout";
const view = "especie";
const title = "Especie";
const formFields = {
  fields: [
    { id: "especie", label: "Especie", required: true },
    { id: "emoji", label: "Emoji", required: true },
  ],
};
const searchFields = formFields.fields.map(f => ({
  ...f, defaultVisible: [ "especie" ].includes(f.id),
}));
export default function DatatablePage() {
  return ( <DataTableLayout {...{ view, title, formFields, searchFields }} width="1/3"
    />
  );
}