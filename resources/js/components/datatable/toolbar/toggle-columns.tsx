import { memo } from "react";
import { SmartDropdown } from "@/components/smart-dropdown";
import { EyeIcon } from "lucide-react";
import { useToggleColumns } from "@/hooks/datatable/toolbar/use-toggle-columns";
export const ToggleColumns = memo(function ToggleColumns({
  columns, columnVisibility, setColumnVisibility,
}) {
  const { items } = useToggleColumns(columns, columnVisibility, setColumnVisibility);
  return (
    <SmartDropdown label="Columnas visibles" items={items} closeOnSelect={false} triggerIcon={EyeIcon} />
  );
});