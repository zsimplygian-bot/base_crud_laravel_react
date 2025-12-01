// components/datatable/toolbar/new-record-button.tsx
import { SmartButton } from "@/components/ui/smart-button"
import { Plus } from "lucide-react"
export const NewRecordButton = ({ view }: { view: string }) => (
  <SmartButton to={`/${view}/form/create`} save icon={Plus} tooltip="Nuevo registro" />
)