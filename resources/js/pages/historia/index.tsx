import { DataTableLayout } from "@/layouts/datatable-layout"
import { FORM_CONFIG } from "@/config/forms"
const { view, title, icon, fields, footerFields, extended_form } = FORM_CONFIG.historia
export default function DatatablePage() {
  return <DataTableLayout {...{ view, title, icon, fields, footerFields, extended_form }} />
}   