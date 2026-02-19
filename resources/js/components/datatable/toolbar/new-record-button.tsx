import { useState } from "react"
import { Plus } from "lucide-react"
import { usePage } from "@inertiajs/react"
import { SmartButton } from "@/components/smart-button"
import { SmartModal } from "@/components/smart-modal"
import { SimpleForm } from "@/components/form/simple-form"
export const NewRecordButton = ({ view, title, fields, onSuccess, icons = [Plus], tooltip, buttonClassName, iconSize = 20 }) => {
  const { auth } = usePage().props
  const [open, setOpen] = useState(false)
  if (auth?.user?.id_rol !== 1 || !view || !fields?.length) return null
  return (
    <>
      <SmartButton
        {...{ tooltip: tooltip ?? `Nuevo ${title}`, className: buttonClassName, onClick: () => setOpen(true), iconSize }}
      >
        <div className="flex gap-1">
          {icons.map((Icon, i) => (
            <Icon key={i} style={{ width: iconSize, height: iconSize }} /> // tamaño dinámico
          ))}
        </div>
      </SmartButton>
      <SmartModal {...{ open, onOpenChange: setOpen, title: `Nuevo ${title}` }}>
        <SimpleForm {...{ mode: "store", endpoint: `/${view}`, fields, open, onSuccess: () => { setOpen(false); onSuccess?.() } }} />
      </SmartModal>
    </>
  )
}
