// hooks/datatable/use-datatable.ts
import { useState, useEffect, useCallback } from "react";
import { useDataTableFetch } from "@/hooks/datatable/use-datatable-fetch";
import { useIsMobile } from "@/hooks/use-mobile";

export const useDataTable = ({ view, queryparams = {} }: { view: string; queryparams?: any }) => {
  const STORAGE_KEY = `datatable_state_${view}`;
  const isMobile = useIsMobile();

  const [isRestored, setIsRestored] = useState(false);

  const [state, setState] = useState({
    pageIndex: 0,
    pageSize: 10,
    sortBy: null as string | null,
    sortOrder: "asc" as "asc" | "desc",
    columnVisibility: {} as Record<string, boolean>,
    dateRange: {} as Record<string, any>,
    selectedColumn: null as string | null,
    searchTerm: "",
    appliedSearchTerm: null as string | null,
    filterValues: queryparams,
  });

  // Restaurar desde localStorage (una sola vez)
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(prev => ({
          ...prev,
          ...parsed,
          filterValues: { ...queryparams, ...(parsed.filterValues || {}) },
        }));
      } catch (e) {
        console.warn("Error parsing saved datatable state", e);
      }
    }
    setIsRestored(true);
  }, [STORAGE_KEY, queryparams]);

  // Guardar en localStorage solo cuando cambie el estado (después de restaurar)
  useEffect(() => {
    if (isRestored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isRestored, STORAGE_KEY]);

  const { data, columns, totalRows, loading } = useDataTableFetch({
    view,
    pageIndex: state.pageIndex,
    pageSize: state.pageSize,
    sortBy: state.sortBy,
    sortOrder: state.sortOrder,
    dateRange: state.dateRange,
    selectedColumn: state.selectedColumn,
    searchTerm: state.appliedSearchTerm,
    filterValues: state.filterValues,
    queryparams: state.filterValues,
    isRestored,
  });

  const resetAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState({
      pageIndex: 0,
      pageSize: 10,
      sortBy: null,
      sortOrder: "asc",
      columnVisibility: {},
      dateRange: {},
      selectedColumn: null,
      searchTerm: "",
      appliedSearchTerm: null,
      filterValues: queryparams,
    });
  }, [queryparams, STORAGE_KEY]);

  return {
    data,
    columns,
    totalRows,
    loading,
    state,
    setState,
    resetAll,
    isMobile,
    isRestored,
  };
};