import { DataTableLayout } from "@/layouts/datatable-layout"
import { FORM_CONFIG } from "@/config/forms"
const { view, title, icon, fields } = FORM_CONFIG.especie
export default function DatatablePage() {
  return <DataTableLayout {...{ view, title, icon, fields, width:"1/3" }} />;
}