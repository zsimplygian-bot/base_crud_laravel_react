import { DataTableLayout } from "@/layouts/datatable-layout"
import { FORM_CONFIG } from "@/config/forms"
const { view, title, fields } = FORM_CONFIG.mascota
const searchFields = fields.map(f => ({
  ...f, defaultVisible: [ "mascota", "id_cliente", "id_raza", "id_sexo" ].includes(f.id),
}));
export default function DatatablePage() {
  return <DataTableLayout {...{ view, title, formFields: fields, searchFields }} />;
}