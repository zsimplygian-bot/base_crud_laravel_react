import { DataTableLayout } from "@/layouts/datatable-layout"
import { VIEW_CONFIG } from "@/config/views"
const { view, title, icon } = VIEW_CONFIG.nps
export default function DatatablePage() {
  return <DataTableLayout {...{ view, title, icon }} />;
}
