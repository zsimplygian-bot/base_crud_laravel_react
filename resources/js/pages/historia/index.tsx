import { DataTableLayout } from "@/layouts/datatable-layout"
import { VIEW_CONFIG } from "@/config/views"
const { view, title, icon, fields, footerFields, extended_form } = VIEW_CONFIG.historia
export default function DatatablePage() {
  return <DataTableLayout {...{ view, title, icon, fields, footerFields, extended_form }} />
}   