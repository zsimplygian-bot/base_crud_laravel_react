import { Button } from "@/components/ui/button";
import { SearchIcon, EraserIcon } from "lucide-react";
import { useTableFilters } from "@/hooks/use-table-filters";
export function TableFiltersButtons({
  localSearchTerm,
  setLocalSearchTerm,
  localSelectedColumn,
  setLocalSelectedColumn,
  localFilterValues,
  setLocalFilterValues,
  setAppliedSearchTerm,
  setSelectedColumn,
  setFilterValues,
  setPageIndex,
  dateRange,
  setDateRange,
  queryparams,
}) {
  const { handleFilterClick, handleClearFilters, hasActiveFilters } = useTableFilters({
    localSearchTerm,
    setLocalSearchTerm,
    localSelectedColumn,
    setLocalSelectedColumn,
    localFilterValues,
    setLocalFilterValues,
    setAppliedSearchTerm,
    setSelectedColumn,
    setFilterValues,
    setPageIndex,
    dateRange,
    setDateRange,
    queryparams,
  });
  return (
    <div className="flex gap-2">
      <Button size="sm" variant="outline" onClick={handleFilterClick} disabled={!hasActiveFilters}>
        <SearchIcon className="w-4 h-4" /> Filtrar
      </Button>
      <Button size="sm" variant="secondary" onClick={handleClearFilters} disabled={!hasActiveFilters}>
        <EraserIcon className="w-4 h-4" /> Limpiar
      </Button>
    </div>
  );
}