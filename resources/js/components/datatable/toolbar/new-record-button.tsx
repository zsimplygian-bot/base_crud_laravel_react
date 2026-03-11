import { useState } from "react"
import { Plus } from "lucide-react"
import { SmartButton } from "@/components/smart-button"
import { SmartModal } from "@/components/smart-modal"
import { SimpleForm } from "@/components/form/simple-form"
import { useHasRole } from "@/hooks/use-hasrole"

export const NewRecordButton = ({ view, title, fields, extended_form, onSuccess, icon, size }) => {
  const isRol2 = useHasRole(2) // Verifica si es rol 2
  if (isRol2) return null // Rol 2 no puede usar este componente

  const [open, setOpen] = useState(false)
  const [formMode, setFormMode] = useState<"store" | "update">("store")
  const [recordId, setRecordId] = useState<number | null>(null)

  const handleSuccess = (rid?: number) => {
    if (rid && view === "historia") {
      setRecordId(rid) // Mantiene el id creado
      setFormMode("update") // Cambia a modo edición
    } else {
      setOpen(false) // Cierra el modal en otros casos
    }
    onSuccess?.()
  }

  return (
    <>
      <SmartButton
        {...{
          tooltip: `Nuevo ${title}`,
          onClick: () => { setFormMode("store"); setRecordId(null); setOpen(true) },
          icons: [Plus, icon],
          size: size ?? "md",
        }}
      />

      <SmartModal
        {...{
          open,
          size: "lg",
          onOpenChange: setOpen,
          title: formMode === "store" ? `Nuevo ${title}` : `Editar ${title}`,
          description: formMode === "store"
            ? "Llena los campos con cuidado"
            : "Actualiza los datos del registro",
          icon,
        }}
      >
        <SimpleForm
          {...{
            mode: formMode,
            endpoint: `/${view}`,
            recordId: recordId ?? undefined,
            fields,
            extended_form,
            open,
            onSuccess: handleSuccess,
          }}
        />
      </SmartModal>
    </>
  )
}