import { useState } from "react"
import { Plus } from "lucide-react"
import { SmartButton } from "@/components/smart-button"
import { SmartModal } from "@/components/smart-modal"
import { SimpleForm } from "@/components/form/simple-form"
import { useHasRole } from "@/hooks/use-hasrole"

export const NewRecordButton = ({ view, title, fields, onSuccess, buttonClassName, icon, size }) => {
  const [open, setOpen] = useState(false)
  const can = useHasRole(1) // Administrador
  if (!can) return null

  return (
    <>
      <SmartButton {...{ tooltip: `Nuevo ${title}`, className: buttonClassName, onClick: () => setOpen(true), icons: [Plus, icon], size }} />
      <SmartModal {...{ open, onOpenChange: setOpen, title: `Nuevo ${title}`, description: "Llena los campos con cuidado", icon }}>
        <SimpleForm {...{ mode: "store", endpoint: `/${view}`, fields, open, onSuccess: () => { setOpen(false); onSuccess?.() } }} />
      </SmartModal>
    </>
  )
}