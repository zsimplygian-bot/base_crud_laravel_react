import { RotateCcwIcon } from "lucide-react";
import { SmartButton } from "@/components/smart-button";
interface ResetFiltersButtonProps {
  filterValues?: Record<string, any>;
  columnVisibility?: Record<string, boolean>;
  dateRange?: { from?: string; to?: string };
  sortBy?: string | null;
  handleResetAll: () => void;
}
export function ResetFiltersButton({
  filterValues = {},
  columnVisibility = {},
  dateRange,
  sortBy,
  handleResetAll
}: ResetFiltersButtonProps) {
  const canReset =
    !!(dateRange?.from || dateRange?.to) ||                // Rango de fechas
    Object.values(filterValues).some(v => v) ||             // Filtros extra
    Object.keys(columnVisibility).length > 0 ||             // Visibilidad alterada
    !!sortBy;                                              // Ordenamiento activo
  return (
    <SmartButton {...{ onClick: handleResetAll, icon: RotateCcwIcon, disabled: !canReset, tooltip: "Restablecer filtros" }} />
  );
}