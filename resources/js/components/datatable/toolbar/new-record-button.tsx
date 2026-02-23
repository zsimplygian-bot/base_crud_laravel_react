import { useState } from "react"
import { Plus } from "lucide-react"
import { usePage } from "@inertiajs/react"
import { SmartButton } from "@/components/smart-button"
import { SmartModal } from "@/components/smart-modal"
import { SimpleForm } from "@/components/form/simple-form"
export const NewRecordButton = (props) => {
  const { view, title, fields, onSuccess, icon, buttonClassName} = props
  const { auth } = usePage().props
  const [open, setOpen] = useState(false)
  if (auth?.user?.id_rol !== 1 || !view || !fields?.length) return null
  const buttonIcons = [Plus, ...(icon ? [icon] : [])] // Plus + icono unico
  return (
    <><SmartButton {...{ tooltip: `Nuevo ${title}`, className: buttonClassName, onClick: () => setOpen(true),  icons: buttonIcons, }} />
      <SmartModal {...{ open, onOpenChange: setOpen, title: `Nuevo ${title}`, icon, description: "Llena los campos con cuidado" }}>
        <SimpleForm {...{ mode: "store", endpoint: `/${view}`, fields, open, onSuccess: () => { setOpen(false); onSuccess?.() }, }} />
      </SmartModal>
    </>
  )
}