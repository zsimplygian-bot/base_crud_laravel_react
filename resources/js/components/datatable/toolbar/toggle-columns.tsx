// toggle-columns.tsx
import { memo, useCallback, useMemo } from "react"; 
import { SmartDropdown } from "@/components/smart-dropdown";
import { EyeIcon } from "lucide-react";
interface Column { header: string; accessor: string; }
interface ToggleColumnsProps {
  columns: Column[];
  columnVisibility: Record<string, boolean>;
  setColumnVisibility: (v: Record<string, boolean>) => void;
}
export const ToggleColumns = memo(function ToggleColumns({ 
  columns, columnVisibility, setColumnVisibility }: ToggleColumnsProps) {
  const toggle = useCallback((key: string, value: boolean) => 
    setColumnVisibility({ ...columnVisibility, [key]: value }), 
    [columnVisibility, setColumnVisibility]
  );
  const items = useMemo(() => 
    columns.map(c => ({ 
      type: "checkbox" as const,
      label: c.header,
      checked: columnVisibility[c.accessor] !== false,
      onChange: v => toggle(c.accessor, v)
    })),
    [columns, columnVisibility, toggle]
  );
  return <SmartDropdown {...{ label: "Columnas visibles", items, closeOnSelect: false, triggerIcon: EyeIcon }} />;
});