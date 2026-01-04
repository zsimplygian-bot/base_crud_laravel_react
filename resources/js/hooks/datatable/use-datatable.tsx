import { useState, useEffect, useCallback } from "react";
import axios from "axios";

type QueryState = {
  pageIndex: number;
  pageSize: number;
  sortBy: string | null;
  sortOrder: "asc" | "desc";
  dateRange?: { from?: string; to?: string };
  appliedSearchValues: Record<string, string>;
};

type UiState = {
  visibleSearchFields: string[];
  columnVisibility: Record<string, boolean>;
};

const DEFAULT_QUERY: QueryState = {
  pageIndex: 0,
  pageSize: 10,
  sortBy: null,
  sortOrder: "desc",
  appliedSearchValues: {},
};

const DEFAULT_UI: UiState = {
  visibleSearchFields: [],
  columnVisibility: {},
};

export const useDataTable = ({ view }: { view: string }) => {
  const STORAGE_KEY = `datatable_state_${view}`;

  const [query, setQuery] = useState<QueryState>(DEFAULT_QUERY);
  const [ui, setUi] = useState<UiState>(DEFAULT_UI);
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isRestored, setIsRestored] = useState(false);

  const buildParams = useCallback(() => {
    const params: Record<string, any> = {
      view,
      page: query.pageIndex + 1,
      limit: query.pageSize,
      sortBy: query.sortBy ?? "id",
      sortOrder: query.sortOrder,
      ...query.dateRange,
    };

    Object.entries(query.appliedSearchValues).forEach(([k, v]) => {
      if (v) params[`filters[${k}]`] = v;
    });

    return params;
  }, [query, view]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.query) setQuery(prev => ({ ...prev, ...parsed.query }));
        if (parsed?.ui) setUi(prev => ({ ...prev, ...parsed.ui }));
      } catch {}
    }
    setIsRestored(true);
  }, [STORAGE_KEY]);

  useEffect(() => {
    if (!isRestored) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ query, ui }));
  }, [query, ui, isRestored, STORAGE_KEY]);

  const fetchData = useCallback(async () => {
    if (!isRestored) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/index", { params: buildParams() });
      setData(res.data.data ?? []);
      setColumns(res.data.columns ?? []);
      setTotalRows(res.data.params?.total ?? 0);
    } catch (e: any) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [isRestored, buildParams]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const resetAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setQuery(DEFAULT_QUERY);
    setUi(DEFAULT_UI);
  }, [STORAGE_KEY]);

  return {
    ...query,
    ...ui,
    data,
    columns,
    totalRows,
    loading,
    error,

    setPageIndex: (v: number) => setQuery(q => ({ ...q, pageIndex: v })),
    setPageSize: (v: number) => setQuery(q => ({ ...q, pageSize: v })),
    setSortBy: (v: string | null) => setQuery(q => ({ ...q, sortBy: v, sortOrder: "desc" })),
    setSortOrder: (v: "asc" | "desc") => setQuery(q => ({ ...q, sortOrder: v })),
    setDateRange: (v?: { from?: string; to?: string }) => setQuery(q => ({ ...q, dateRange: v })),
    setAppliedSearchValues: (v: Record<string, string>) =>
      setQuery(q => ({ ...q, appliedSearchValues: v })),

    setColumnVisibility: (v: Record<string, boolean>) =>
      setUi(u => ({ ...u, columnVisibility: v })),

    setVisibleSearchFields: (v: string[]) =>
      setUi(u => ({ ...u, visibleSearchFields: v })),

    fetchData,
    resetAll,
  };
};
