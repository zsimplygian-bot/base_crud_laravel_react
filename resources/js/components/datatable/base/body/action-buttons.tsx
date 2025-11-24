import { memo } from "react";
import { Button } from "@/components/ui/button";
import { CopyIcon, EyeIcon, EditIcon, TrashIcon, FileTextIcon } from "lucide-react";
import DropdownMenuBase from "@/components/dropdown-menu";
export const ActionButtons = memo(function ActionButtons({
  row_id,
  view,
}: {
  row_id: string;
  view: string;
}) {
  const base = `/${view}/form`;
  const allowPrint = view === "historia_clinica";
  return (
    <DropdownMenuBase
      label="Acciones"
      trigger={
        <Button variant="ghost" size="sm" aria-label="Acciones">
          …
        </Button>
      }
      items={[
        { label: "Copiar ID", icon: CopyIcon, action: () => navigator.clipboard.writeText(row_id) },
        { label: "Detalle", href: `${base}/info/${row_id}`, icon: EyeIcon, color: "text-blue-600" },
        { label: "Editar", href: `${base}/update/${row_id}`, icon: EditIcon, color: "text-green-600" },
        { label: "Eliminar", href: `${base}/delete/${row_id}`, icon: TrashIcon, color: "text-red-600" },
        ...(allowPrint
          ? [ { label: "Imprimir", href: `/${view}/pdf/${row_id}`, external: true, icon: FileTextIcon, color: "text-cyan-600"},]
          : []),
      ]}
    />
  );
});