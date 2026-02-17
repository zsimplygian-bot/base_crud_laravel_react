import { DataTableLayout } from "@/layouts/datatable-layout"
import { FORM_CONFIG } from "@/config/forms"
const { view, title, fields } = FORM_CONFIG.cliente
const searchFields = fields.map(f => ({
  ...f, defaultVisible: [ "cliente", "telefono" ].includes(f.id),
}));
export default function DatatablePage() {
  return <DataTableLayout {...{ view, title, formFields: fields, searchFields }} />;
}