import { useEffect, useState, useMemo, useCallback } from "react";

interface DateRange {
  from?: Date | string | null;
  to?: Date | string | null;
}

export interface FetchOptions {
  view: string;
  pageIndex: number;
  pageSize: number;
  sortBy: string | null;
  sortOrder: "asc" | "desc";
  dateRange?: DateRange;
  selectedColumn: string | null;
  searchTerm: string | null;
  filterValues?: Record<string, string>;
  queryparams?: Record<string, any>;
  isRestored: boolean;
}

export const useDataTableFetch = ({
  view,
  pageIndex,
  pageSize,
  sortBy,
  sortOrder,
  dateRange,
  selectedColumn,
  searchTerm,
  filterValues = {},
  queryparams = {},
  isRestored,
}: FetchOptions) => {

  const STORAGE_KEY = `datatable_state_${view}`;

  // Normalizar DateRange para permitir strings o Date sin romper
  const memoizedDateRange = useMemo(() => {
    const normalize = (v?: Date | string | null) => {
      if (!v) return undefined;
      const d = v instanceof Date ? v : new Date(v);
      return isNaN(d.getTime()) ? undefined : d.toISOString().split("T")[0];
    };
    return {
      from: normalize(dateRange?.from),
      to: normalize(dateRange?.to),
    };
  }, [dateRange?.from, dateRange?.to]);

  // Guardar estado en localStorage cuando cambie
  useEffect(() => {
    if (!isRestored) return;
    const stateToSave = {
      pageIndex,
      pageSize,
      sortBy,
      sortOrder,
      selectedColumn,
      searchTerm,
      filterValues,
      queryparams,
      dateRange: memoizedDateRange,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [
    isRestored,
    pageIndex,
    pageSize,
    sortBy,
    sortOrder,
    selectedColumn,
    searchTerm,
    JSON.stringify(filterValues),
    JSON.stringify(queryparams),
    memoizedDateRange.from,
    memoizedDateRange.to,
  ]);

  const [data, setData] = useState<any[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
  if (!isRestored) return;

  const params = new URLSearchParams();
  params.set("view", view);
  params.set("page", String(pageIndex + 1));
  params.set("limit", String(pageSize));

  // Ordenamiento
  const sortColumn = sortBy || "id"; // default id
  const sortDirection = sortOrder || "desc"; // default desc
  params.set("sortBy", sortColumn);
  params.set("sortOrder", sortDirection);

  // Búsqueda por columna seleccionada
  if (selectedColumn && searchTerm) {
    params.set("column", selectedColumn); // solo para search
    params.set("search", searchTerm);
  }

  // Fechas
  if (memoizedDateRange.from) params.set("from", memoizedDateRange.from);
  if (memoizedDateRange.to) params.set("to", memoizedDateRange.to);

  // Filtros adicionales
  Object.entries(filterValues).forEach(([k, v]) => v && params.set(k, v));
  Object.entries(queryparams).forEach(([k, v]) => v && params.set(k, String(v)));

  const url = `/api/index?${params.toString()}`;
  console.log("[FETCH]", url);

  try {
    setLoading(true);
    const res = await fetch(url);
    const result = await res.json();
    setData(result.data ?? []);
    setTotalRows(result.total ?? 0);
  } catch {
    setData([]);
    setTotalRows(0);
  } finally {
    setLoading(false);
  }
}, [
  isRestored,
  view,
  pageIndex,
  pageSize,
  sortBy,
  sortOrder,
  memoizedDateRange.from,
  memoizedDateRange.to,
  selectedColumn,
  searchTerm,
  JSON.stringify(filterValues),
  JSON.stringify(queryparams),
]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, totalRows, loading, refetch: fetchData };
};
