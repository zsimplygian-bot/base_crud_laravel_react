import { DataTableLayout } from "@/layouts/datatable-layout"
import { VIEW_CONFIG } from "@/config/views"
const { view, title, icon, fields } = VIEW_CONFIG.producto
export default function DatatablePage() {
  return <DataTableLayout {...{ view, title, icon, fields }} />;
}