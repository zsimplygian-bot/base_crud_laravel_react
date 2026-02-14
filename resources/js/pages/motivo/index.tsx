import { DataTableLayout } from "@/layouts/datatable-layout";
const view = "motivo";
const title = "Motivo";
const formFields = {
  fields: [
    { id: "motivo", label: "Motivo", required: true },
    { id: "emoji_motivo", label: "Emoji motivo" },
  ],
};
const searchFields = formFields.fields.map(f => ({
  ...f, defaultVisible: [ "motivo" ].includes(f.id),
}));
export default function DatatablePage() {
  return <DataTableLayout {...{ view, title, formFields, searchFields, width:"1/3" }} />;
}
