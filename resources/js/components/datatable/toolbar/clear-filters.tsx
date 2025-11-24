import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
export function TableFiltersButtons({
  localFilterValues,
  setFilterValues,
  setPageIndex,
}) {
  const hasActiveFilters = Object.values(localFilterValues || {}).some(
    (v) => v !== null && v !== "" && v !== undefined
  );
  const applyFilters = () => {
    setFilterValues(localFilterValues);
    setPageIndex(0);
  };
  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={applyFilters}
        disabled={!hasActiveFilters}
      >
        <SearchIcon className="w-4 h-4" /> Filtrar
      </Button>
    </div>
  );
}