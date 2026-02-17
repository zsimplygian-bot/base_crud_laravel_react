import { DataTableLayout } from "@/layouts/datatable-layout"
import { FORM_CONFIG } from "@/config/forms"
const { view, title, fields, footerFields, extendedFields } = FORM_CONFIG.historia_clinica
export default function DatatablePage() {
  return <DataTableLayout {...{ view, title, fields, footerFields, extendedFields }} />
}   