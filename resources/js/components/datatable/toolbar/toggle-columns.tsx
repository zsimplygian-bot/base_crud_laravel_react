import { memo } from "react";
import { Button } from "@/components/ui/button";
import DropdownMenuBase from "@/components/dropdown-menu-base";
import { EyeIcon } from "lucide-react";
import { useToggleColumns } from "@/hooks/datatable/toolbar/use-toggle-columns";
export const ToggleColumns = memo(function ToggleColumns({
  columns,
  columnVisibility,
  setColumnVisibility,
}) {
  const { items } = useToggleColumns(columns, columnVisibility, setColumnVisibility);
  return (
    <DropdownMenuBase
      label="Columnas visibles"
      closeOnSelect={false}
      trigger={
        <Button variant="outline" size="sm">
          <EyeIcon className="w-3 h-3 opacity-80" /> Vista
        </Button>
      }
      items={items}
    />
  );
});