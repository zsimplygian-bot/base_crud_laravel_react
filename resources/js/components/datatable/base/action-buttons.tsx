// frontend/components/datatable/action-buttons.tsx
import { useState, useCallback, useMemo } from "react"
import { CopyIcon, EyeIcon, EditIcon, TrashIcon, FileTextIcon, MoreVertical } from "lucide-react"
import { toast } from "@/components/ui/sonner"
import { SmartDropdown } from "@/components/smart-dropdown"
import { SmartModal } from "@/components/smart-modal"
import { SmartButton } from "@/components/smart-button"
import { SimpleForm } from "@/components/form/simple-form"
import { useHasRole } from "@/hooks/use-hasrole"

type ActionType = "store" | "info" | "update" | "delete" | null

export const ActionButtons = ({ row_id, view, title, icon, fields, extended_form, onSuccess, eye, size }: any) => {
  const canAdmin = useHasRole(1)
  const [open, setOpen] = useState(false)
  const [action, setAction] = useState<ActionType>(null)

  const openForm = useCallback((t: ActionType) => { setAction(t); setOpen(true) }, [])
  const copyId = useCallback(() => { navigator.clipboard.writeText(row_id); toast.success("ID copiado al portapapeles") }, [row_id])

  const items = useMemo(() => [
    { label: "Copiar ID", icon: CopyIcon, action: copyId },
    { key: "info", label: "Detalle", icon: EyeIcon, color: "text-blue-500", modal: { title: "Detalle", description: "Consulta los datos del registro." }, action: () => openForm("info") },
    ...(canAdmin ? [
      { key: "update", label: "Editar", icon: EditIcon, color: "text-green-500", modal: { title: "Editar", description: "Actualiza los datos del registro." }, action: () => openForm("update") },
      { key: "delete", label: "Eliminar", icon: TrashIcon, color: "text-red-500", modal: { title: "Eliminar", description: "Confirma para eliminar este registro." }, action: () => openForm("delete") },
    ] : []),
    ...(view === "historia" ? [
      { key: "print", label: "Imprimir", icon: FileTextIcon, color: "text-cyan-600", action: () => window.open(`/${view}/pdf/${row_id}`, "_blank") },
    ] : []),
  ], [canAdmin, copyId, openForm, row_id, view])

  const activeItem = useMemo(() => items.find(i => i.key === action), [items, action])

  return (
    <>
      <div className="flex items-center gap-1">
        {eye ? <SmartButton {...{ icons: EyeIcon, variant: "ghost", tooltip: "Ver detalle", size: "xs", onClick: () => openForm("info") }} />
          : <SmartDropdown {...{ label: "Acciones", triggerIcon: MoreVertical, triggerVariant: "ghost", items, size: size ?? "md" }} />}
      </div>

      {action && activeItem?.modal && (
        <SmartModal {...{ open, onOpenChange: setOpen, title: `${activeItem.modal.title} ${title}`, icon, description: activeItem.modal.description }}>
          <SimpleForm {...{ mode: action, endpoint: `/${view}`, recordId: row_id, fields, extended_form, open, onSuccess: () => { setOpen(false); onSuccess?.() } }} />
        </SmartModal>
      )}
    </>
  )
}