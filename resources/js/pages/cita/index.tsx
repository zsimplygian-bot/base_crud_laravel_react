import { DataTableLayout } from "@/layouts/datatable-layout"
import { FORM_CONFIG } from "@/config/forms"
const { view, title, fields } = FORM_CONFIG.cita
const searchFields = fields.map(f => ({
  ...f, defaultVisible: [ "id_mascota", "id_motivo", "id_estado_cita" ].includes(f.id),
}));
export default function DatatablePage() {
  return <DataTableLayout {...{ view, title, formFields: fields, searchFields }} />;
}