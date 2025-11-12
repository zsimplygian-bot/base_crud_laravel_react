import { useMemo } from "react";
export function useTableFilters({
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
  const hasActiveFilters = useMemo(
    () => Object.values(localFilterValues).some(v => v && v.trim() !== ""),
    [localFilterValues]
  );
  const updateQueryParams = params => {
    const url = new URL(window.location.href);
    Object.entries(params).forEach(([k, v]) =>
      v ? url.searchParams.set(k, v) : url.searchParams.delete(k)
    );
    window.history.replaceState({}, "", url.toString());
  };
  const handleFilterClick = () => {
    const term = localSearchTerm?.trim() || null;
    setSelectedColumn(localSelectedColumn);
    setAppliedSearchTerm(term);
    setFilterValues?.(localFilterValues);
    setPageIndex(0);
    updateQueryParams({ ...(queryparams || {}), ...localFilterValues });
  };
  const handleClearFilters = () => {
    setLocalSearchTerm("");
    setLocalSelectedColumn(null);
    setLocalFilterValues({});
    setDateRange(undefined);
    setAppliedSearchTerm(null);
    setSelectedColumn(null);
    setFilterValues?.({});
    setPageIndex(0);
    window.history.replaceState({}, "", window.location.pathname);
  };
  return {
    handleFilterClick,
    handleClearFilters,
    hasActiveFilters,
  };
}