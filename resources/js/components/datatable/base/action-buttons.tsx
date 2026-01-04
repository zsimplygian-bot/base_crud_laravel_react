import { useState } from "react";
import { CopyIcon, EyeIcon, EditIcon, TrashIcon, FileTextIcon, MoreVertical } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { SmartDropdown } from "@/components/smart-dropdown";
import { SmartModal } from "@/components/smart-modal";
import { SimpleForm } from "@/components/form/simple-form";

type ActionType = "store" | "info" | "update" | "delete" | null;

export const ActionButtons = ({
  row_id,
  view,
  formFields,
  onSuccess,
}: {
  row_id: string;
  view: string;
  formFields: Record<string, any>;
  onSuccess?: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState<ActionType>(null);

  const meta = {
    store: ["Nuevo", "Registrar nuevo elemento."],
    info: ["Detalle", "Consulta los datos del registro."],
    update: ["Editar", "Actualiza los datos del registro."],
    delete: ["Eliminar", "Confirma para eliminar este registro."],
  };

  const openForm = (type: ActionType) => {
    setAction(type);
    setOpen(true);
  };

  return (
    <>
      <SmartDropdown
        label="Acciones"
        triggerIcon={MoreVertical}
        triggerVariant="ghost"
        items={[
          {
            label: "Copiar ID",
            icon: CopyIcon,
            action: () => {
              navigator.clipboard.writeText(row_id);
              toast.success("ID copiado al portapapeles");
            },
          },
          { label: "Detalle", icon: EyeIcon, color: "text-blue-600", action: () => openForm("info") },
          { label: "Editar", icon: EditIcon, color: "text-green-600", action: () => openForm("update") },
          { label: "Eliminar", icon: TrashIcon, color: "text-red-600", action: () => openForm("delete") },
          ...(view === "historia_clinica"
            ? [{
                label: "Imprimir",
                icon: FileTextIcon,
                color: "text-cyan-600",
                to: `/${view}/pdf/${row_id}`,
                external: true,
              }]
            : []),
        ]}
      />

      {action && (
        <SmartModal
          type="sheet"
          open={open}
          onOpenChange={setOpen}
          title={`${meta[action][0]} ${view}`}
          description={meta[action][1]}
          size="w-[90%] sm:w-[400px]"
        >
          <SimpleForm
            mode={action}
            endpoint={`/${view}`}
            recordId={row_id}
            fields={formFields.fields}
            open={open} // 🔑 CLAVE: habilita fetch de listas
            onSuccess={() => {
              setOpen(false);
              onSuccess?.();
            }}
          />
        </SmartModal>
      )}
    </>
  );
};
