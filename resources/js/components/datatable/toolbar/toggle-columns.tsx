import { memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import DropdownMenuBase from "@/components/dropdown-menu";
import { EyeIcon } from "lucide-react";
export const ToggleColumns = memo(function ToggleColumns({
  columns,
  columnVisibility,
  setColumnVisibility,
}: {
  columns: { header: string; accessor: string }[];
  columnVisibility: Record<string, boolean>;
  setColumnVisibility: (v: Record<string, boolean>) => void;
}) {
  const toggle = useCallback(
    (key: string, value: boolean) =>
      setColumnVisibility(prev => ({ ...prev, [key]: value })),
    [setColumnVisibility]
  );
  return (
    <DropdownMenuBase
      label="Columnas visibles"
      closeOnSelect={false}
      trigger={
        <Button variant="outline" size="sm">
          <EyeIcon className="w-3 h-3 opacity-80" />
          Vista
        </Button>
      }
      items={columns.map(c => ({
        type: "checkbox",
        label: c.header,
        checked: columnVisibility[c.accessor] !== false,
        onChange: val => toggle(c.accessor, val),
      }))}
    />
  );
});