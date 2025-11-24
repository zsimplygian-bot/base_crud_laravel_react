// hooks/use-datatable-persistence.ts
import { useState, useEffect } from "react";

export const useDataTablePersistence = (view: string, initialQueryparams: Record<string, any> = {}) => {
  const STORAGE_KEY = `datatable_state_${view}`;

  const [isRestored, setIsRestored] = useState(false);

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [columnVisibility, setColumnVisibility] = useState({});
  const [dateRange, setDateRange] = useState({});
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearchTerm, setAppliedSearchTerm] = useState<string | null>(null);
  const [filterValues, setFilterValues] = useState(initialQueryparams);

  // Cargar desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const s = JSON.parse(saved);
        setPageIndex(s.pageIndex ?? 0);
        setPageSize(s.pageSize ?? 10);
        setSortBy(s.sortBy ?? null);
        setSortOrder(s.sortOrder ?? "asc");
        setColumnVisibility(s.columnVisibility ?? {});
        setDateRange(s.dateRange ?? {});
        setSelectedColumn(s.selectedColumn ?? null);
        setAppliedSearchTerm(s.searchTerm ?? null);
        setSearchTerm(s.searchTerm ?? "");
        setFilterValues(prev => ({ ...prev, ...s.filterValues }));
      } catch (e) {
        console.warn("Error loading datatable state", e);
      }
    }
    setIsRestored(true);
  }, [STORAGE_KEY]);

  // Guardar en localStorage cada vez que cambie algo
  useEffect(() => {
    if (!isRestored) return;

    const stateToSave = {
      pageIndex,
      pageSize,
      sortBy,
      sortOrder,
      columnVisibility,
      dateRange,
      selectedColumn,
      searchTerm: appliedSearchTerm,
      filterValues,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [
    isRestored,
    pageIndex,
    pageSize,
    sortBy,
    sortOrder,
    columnVisibility,
    dateRange,
    selectedColumn,
    appliedSearchTerm,
    filterValues,
  ]);

  const handleResetAll = () => {
    localStorage.removeItem(STORAGE_KEY);
    setPageIndex(0);
    setPageSize(10);
    setSortBy(null);
    setSortOrder("desc");
    setColumnVisibility({});
    setDateRange({});
    setSelectedColumn(null);
    setSearchTerm("");
    setAppliedSearchTerm(null);
    setFilterValues(initialQueryparams);
  };

  return {
    // Estados
    pageIndex,
    pageSize,
    sortBy,
    sortOrder,
    columnVisibility,
    dateRange,
    selectedColumn,
    searchTerm,
    appliedSearchTerm,
    filterValues,
    isRestored,

    // Setters
    setPageIndex,
    setPageSize,
    setSortBy,
    setSortOrder,
    setColumnVisibility,
    setDateRange,
    setSelectedColumn,
    setSearchTerm,
    setAppliedSearchTerm,
    setFilterValues,

    // Funciones
    handleResetAll,
  };
};