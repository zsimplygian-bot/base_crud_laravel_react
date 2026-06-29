import { useState, useCallback, useMemo } from "react";
import { CopyIcon, EyeIcon, EditIcon, TrashIcon, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import { SmartDropdown } from "@/components/smart-dropdown";
import { SmartModal } from "@/components/smart-modal";
import { SmartButton } from "@/components/smart-button";
import { SimpleForm } from "@/components/form/simple-form";
import { useHasRole } from "@/hooks/use-hasrole";
import { getExtraActions, shouldIgnoreBaseActions } from "./extra-action-buttons";

export const ActionButtons = ({ row_id, view, title, icon, fields, extended_form, onSuccess, eye, size }: any) => {
  const canAdmin = useHasRole([1, 3]);
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState<string | null>(null);

  const openForm = useCallback((t: any) => { setAction(t); setOpen(true) }, []);
  const copyId = useCallback(() => { navigator.clipboard.writeText(row_id); toast.success("ID copiado"); }, [row_id]);

  const items = useMemo(() => {
    const base = [
      { label: "Copiar ID", icon: CopyIcon, action: copyId },
      { key: "info", label: "Detalle", icon: EyeIcon, color: "text-blue-500", modal: { title: "Detalle", description: "Consulta los datos." }, action: () => openForm("info") },
      ...(canAdmin ? [
        { key: "update", label: "Editar", icon: EditIcon, color: "text-green-500", modal: { title: "Editar", description: "Actualiza los datos." }, action: () => openForm("update") },
        { key: "delete", label: "Eliminar", icon: TrashIcon, color: "text-red-500", modal: { title: "Eliminar", description: "Confirma para eliminar." }, action: () => openForm("delete") },
      ] : []),
    ];

    const extra = getExtraActions(view, row_id, onSuccess);

    // Si la vista está en la lista de ignorar base, devolvemos solo las extras
    return shouldIgnoreBaseActions(view) ? extra : [...base, ...extra];
  }, [canAdmin, copyId, openForm, row_id, view, onSuccess]);

  const activeItem = useMemo(() => items.find(i => i.key === action), [items, action]);

  return (
    <>
      <div className="flex items-center gap-1">
        {eye ? 
          <SmartButton {...{ icons: EyeIcon, variant: "ghost", tooltip: "Ver detalle", size: "xs", onClick: () => openForm("info") }} /> : 
          <SmartDropdown {...{ label: "Acciones", triggerIcon: MoreVertical, triggerVariant: "ghost", items, size: size ?? "md" }} />
        }
      </div>

      {action && activeItem?.modal && (
        <SmartModal {...{ open, onOpenChange: setOpen, title: `${activeItem.modal.title} ${title}`, icon, description: activeItem.modal.description }}>
          <SimpleForm {...{ mode: action, endpoint: `/${view}`, recordId: row_id, fields, extended_form, open, onSuccess: () => { setOpen(false); onSuccess?.() } }} />
        </SmartModal>
      )}
    </>
  );
};