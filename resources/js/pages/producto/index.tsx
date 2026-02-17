import { DataTableLayout } from "@/layouts/datatable-layout"
import { FORM_CONFIG } from "@/config/forms"
const { view, title, fields } = FORM_CONFIG.producto
export default function DatatablePage() {
  return <DataTableLayout {...{ view, title, fields }} />;
}