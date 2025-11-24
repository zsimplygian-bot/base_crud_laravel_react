import { useMemo } from "react";
export function useResetFilters({
  localSearchTerm,
  localSelectedColumn,
  dateRange,
  localFilterValues,
  columnVisibility,
  pageIndex,
  pageSize,
  sortBy,
  handleResetAll,
}) {
  const canReset = useMemo(() => {
    const hasSearch = localSearchTerm.trim().length > 0;
    const hasColumn = !!localSelectedColumn;
    const hasDate = !!(dateRange?.from || dateRange?.to);
    const hasFilterValues = Object.values(localFilterValues || {}).some(v => v);
    const hasVisibleColumns = Object.keys(columnVisibility || {}).length > 0;
    const hasCustomPageIndex = pageIndex !== 0;
    const hasCustomPageSize = pageSize !== 10;
    const hasSorting = !!sortBy;
    return (
      hasSearch ||
      hasColumn ||
      hasDate ||
      hasFilterValues ||
      hasVisibleColumns ||
      hasCustomPageIndex ||
      hasCustomPageSize ||
      hasSorting
    );
  }, [
    localSearchTerm,
    localSelectedColumn,
    dateRange,
    localFilterValues,
    columnVisibility,
    pageIndex,
    pageSize,
    sortBy,
  ]);
  return {
    canReset,
    reset: handleResetAll,
  };
}