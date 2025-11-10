import { useEffect, useState, useMemo, useCallback } from "react";

interface DateRange {
  from?: Date;
  to?: Date;
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
      dateRange: {
        from: dateRange?.from?.toISOString() ?? null,
        to: dateRange?.to?.toISOString() ?? null,
      },
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
    dateRange?.from,
    dateRange?.to,
  ]);

  const [data, setData] = useState<any[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);

  const memoizedDateRange = useMemo(() => ({
    from: dateRange?.from ? dateRange.from.toISOString().split("T")[0] : undefined,
    to: dateRange?.to ? dateRange.to.toISOString().split("T")[0] : undefined,
  }), [dateRange?.from, dateRange?.to]);

  const fetchData = useCallback(async () => {
    if (!isRestored) return;

    const params = new URLSearchParams();
    params.set("view", view);
    params.set("page", String(pageIndex + 1));
    params.set("limit", String(pageSize)); // CORREGIDO: backend usa limit

    if (sortBy) params.set("column", sortBy); // CORREGIDO
    if (sortOrder) params.set("sortOrder", sortOrder); // CORREGIDO

    if (memoizedDateRange.from) params.set("from", memoizedDateRange.from);
    if (memoizedDateRange.to) params.set("to", memoizedDateRange.to);

    if (selectedColumn && searchTerm) {
      params.set("column", selectedColumn);
      params.set("search", searchTerm);
    }

    Object.entries(filterValues).forEach(([k, v]) => {
      if (v !== null && v !== "") params.set(k, String(v));
    });

    Object.entries(queryparams).forEach(([k, v]) => {
      if (v !== null && v !== "") params.set(k, String(v));
    });

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
