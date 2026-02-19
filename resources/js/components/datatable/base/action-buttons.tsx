import { useState, useCallback } from "react"
import { usePage } from "@inertiajs/react"
import { CopyIcon, EyeIcon, EditIcon, TrashIcon, FileTextIcon, MoreVertical } from "lucide-react"
import { toast } from "@/components/ui/sonner"
import { SmartDropdown } from "@/components/smart-dropdown"
import { SmartModal } from "@/components/smart-modal"
import { SimpleForm } from "@/components/form/simple-form"
import { ExtendedForm } from "@/components/form/extended-form"
type ActionType = "store" | "info" | "update" | "delete" | null
export const ActionButtons = ({ row_id, view, title, fields, extendedFields, onSuccess }: any) => {
  const { auth } = usePage().props, isAdmin = auth?.user?.id_rol === 1
  const [open, setOpen] = useState(false), [action, setAction] = useState<ActionType>(null)
  const openForm = useCallback((t: ActionType) => { setAction(t); setOpen(true) }, [])
  const items = [
    { label: "Copiar ID", icon: CopyIcon, action: () => { navigator.clipboard.writeText(row_id); toast.success("ID copiado al portapapeles") } },
    { key: "info", label: "Detalle", icon: EyeIcon, color: "text-blue-500", modal: { title: "Detalle", description: "Consulta los datos del registro." }, action: () => openForm("info") },
    ...(isAdmin ? [
      { key: "update", label: "Editar", icon: EditIcon, color: "text-green-500", modal: { title: "Editar", description: "Actualiza los datos del registro." }, action: () => openForm("update") },
      { key: "delete", label: "Eliminar", icon: TrashIcon, color: "text-red-500", modal: { title: "Eliminar", description: "Confirma para eliminar este registro." }, action: () => openForm("delete") }
    ] : []),
    ...(view === "historia_clinica" ? [
      { key: "print", label: "Imprimir", icon: FileTextIcon, color: "text-cyan-600",
        action: () => window.open(`/${view}/pdf/${row_id}`, "_blank") // Navegación explícita
      }
    ] : [])
  ]
  const activeItem = items.find(i => i.key === action)
  return (
    <>
      <SmartDropdown {...{ label: "Acciones", triggerIcon: MoreVertical, triggerVariant: "ghost", items }} />
      {action && activeItem?.modal && (
        <SmartModal {...{ type: "sheet", open, onOpenChange: setOpen, title: `${activeItem.modal.title} ${title}`, description: activeItem.modal.description, size: "w-[90%] sm:w-[450px]" }}>
          <SimpleForm {...{ mode: action, endpoint: `/${view}`, recordId: row_id, fields, extendedFields, ExtendedForm, open, onSuccess: () => { setOpen(false); onSuccess?.() } }} />
        </SmartModal>
      )}
    </>
  )
}