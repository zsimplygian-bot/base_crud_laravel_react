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
  filterValues?: Record<string, any>;
  isRestored: boolean;
  resetTrigger?: number;
}
export const useDataTableFetch = ({
  view,
  pageIndex,
  pageSize,
  sortBy,
  sortOrder,
  dateRange,
  selectedColumn,
  searchTerm = "",
  filterValues = {},
  isRestored,
  resetTrigger = 0,
}: FetchOptions) => {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  // Normalizar fechas únicamente para el backend
  const normalizedDateRange = useMemo(() => {
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
  // Clave estable de filtros para evitar loops infinitos
  const filterValuesKey = useMemo(() => {
    return JSON.stringify(
      Object.entries(filterValues)
        .filter(([, v]) => v !== undefined && v !== null && v !== "")
        .sort(([a], [b]) => a.localeCompare(b))
    );
  }, [filterValues]);
  const fetchData = useCallback(async () => {
    if (!isRestored) return;
    setLoading(true);
    const params = new URLSearchParams();
    params.set("view", view);
    params.set("page", String(pageIndex + 1));
    params.set("limit", String(pageSize));
    params.set("sortBy", sortBy || "id");
    params.set("sortOrder", sortOrder);
    if (selectedColumn && searchTerm.trim()) {
      params.set("column", selectedColumn);
      params.set("search", searchTerm.trim());
    }
    if (normalizedDateRange.from) params.set("from", normalizedDateRange.from);
    if (normalizedDateRange.to) params.set("to", normalizedDateRange.to);
    // Filtros
    Object.entries(filterValues).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      params.set(key, String(value));
    });
    const url = `/api/index?${params.toString()}`;
    console.log("[FETCH]", url);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Fetch failed");
      const result = await res.json();
      // NO normalizamos columnas
      setData(result.data ?? []);
      setColumns(result.columns ?? []);
      setTotalRows(result.params?.total ?? result.total ?? 0);
    } catch (err) {
      console.error("[useDataTableFetch] Error:", err);
      setData([]);
      setColumns([]);
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
    selectedColumn,
    searchTerm,
    normalizedDateRange.from,
    normalizedDateRange.to,
    filterValuesKey,
    resetTrigger,
  ]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return {
    data,
    columns,
    totalRows,
    loading,
    refetch: fetchData,
  };
};