import { useState, useCallback } from "react";
import { CopyIcon, EyeIcon, EditIcon, TrashIcon, FileTextIcon, MoreVertical } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { SmartDropdown } from "@/components/smart-dropdown";
import { SmartModal } from "@/components/smart-modal";
import { SimpleForm } from "@/components/form/simple-form";
import { ExtendedForm } from "@/components/form/extended-form";
type ActionType = "store" | "info" | "update" | "delete" | null;
export const ActionButtons = ({
  row_id, view, title, formFields, extendedFields, onSuccess, }: {
    row_id: string;
    view: string;
    title: string;
    formFields: Record<string, any>;
    extendedFields?: Record<string, any>;
    onSuccess?: () => void;
  }) => {
  const [open, setOpen] = useState(false), [action, setAction] = useState<ActionType>(null);
  const openForm = useCallback((type: ActionType) => {
    setAction(type); setOpen(true);
  }, []);
  const items = [
    { label: "Copiar ID", icon: CopyIcon, action: () => {
        navigator.clipboard.writeText(row_id); toast.success("ID copiado al portapapeles"); },
    },
    { key: "info", label: "Detalle", icon: EyeIcon, color: "text-blue-600",
        modal: { title: "Detalle", description: "Consulta los datos del registro.", },
      action: () => openForm("info"),
    },
    { key: "update", label: "Editar", icon: EditIcon, color: "text-green-600",
          modal: { title: "Editar", description: "Actualiza los datos del registro.", },
      action: () => openForm("update"),
    },
    { key: "delete", label: "Eliminar", icon: TrashIcon, color: "text-red-600",
        modal: { title: "Eliminar", description: "Confirma para eliminar este registro.", },
      action: () => openForm("delete"),
    },
    ...(view === "historia_clinica"
      ? [{ label: "Imprimir", icon: FileTextIcon, color: "text-cyan-600", to: `/${view}/pdf/${row_id}`, external: true,
        }] : []),
    ];
  const activeItem = items.find(i => i.key === action);
  return (
    <><SmartDropdown {...{ label: "Acciones", triggerIcon: MoreVertical, triggerVariant: "ghost", items,  }} />
      {action && activeItem?.modal && (
        <SmartModal {...{  type: "sheet", open, onOpenChange: setOpen,
            title: `${activeItem.modal.title} ${title}`, description: activeItem.modal.description,
            size: "w-[90%] sm:w-[400px]",  }} >
          <SimpleForm
            {...{ mode: action, endpoint: `/${view}`, recordId: row_id, fields: formFields.fields, extendedFields,
              ExtendedForm, open,
              onSuccess: () => {
                setOpen(false);
                onSuccess?.();
              },
            }}
          />
        </SmartModal>
      )}
    </>
  );
};