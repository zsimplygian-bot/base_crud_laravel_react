import { useState } from "react"
import { Plus } from "lucide-react"
import { usePage } from "@inertiajs/react"
import { SmartButton } from "@/components/smart-button"
import { SmartModal } from "@/components/smart-modal"
import { SimpleForm } from "@/components/form/simple-form"
export const NewRecordButton = ({ view, title, formFields, onSuccess, icon = Plus, tooltip, buttonVariant = "default", buttonClassName }) => {
  const { auth } = usePage().props
  const [open, setOpen] = useState(false)
  if (auth?.user.id_rol !== 1 || !view || !formFields) return null // Solo administrador y datos válidos
  return (
    <>
      <SmartButton {...{ icon, tooltip: tooltip ?? `Nuevo ${title}`, variant: buttonVariant, className: buttonClassName, onClick: () => setOpen(true) }} />
      <SmartModal {...{ open, onOpenChange: setOpen, title: `Nuevo ${title}`, description: "Ingresa los datos correctamente" }}>
        <SimpleForm {...{ mode: "store", endpoint: `/${view}`, fields: formFields.fields, open, onSuccess: () => { setOpen(false); onSuccess?.() } }} />
      </SmartModal>
    </>
  )
}