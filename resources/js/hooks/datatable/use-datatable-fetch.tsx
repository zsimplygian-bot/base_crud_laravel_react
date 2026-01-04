import { useMemo, useCallback } from "react";
import { useApi } from "@/hooks/use-api";

interface UseDataTableFetchProps {
  view: string;
  pageIndex: number;
  pageSize: number;
  sortBy: string | null;
  sortOrder: "asc" | "desc";
  dateRange: Record<string, any>;
  filters?: Record<string, string>;
  isRestored: boolean;
}

export const useDataTableFetch = ({
  view, pageIndex, pageSize, sortBy, sortOrder,
  dateRange, filters = {}, isRestored,
}: UseDataTableFetchProps) => {

  const params = useMemo(() => {
    if (!isRestored) return null;

    const p: Record<string, any> = {
      view,
      page: pageIndex + 1,
      limit: pageSize,
      sortBy: sortBy ?? "id",
      sortOrder: sortOrder ?? "desc",
    };

    if (dateRange?.from) p.from = dateRange.from;
    if (dateRange?.to) p.to = dateRange.to;

    // Aquí aplicamos los filtros persistentes
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== "" && v != null) {
        p[`filters[${k}]`] = v;
      }
    });
    return p;
  }, [isRestored, view, pageIndex, pageSize, sortBy, sortOrder, dateRange?.from, dateRange?.to, filters]);
  const { data, loading, error, refetch } = useApi("/api/index", {
    autoFetch: false,
    params,
    transform: res => ({
      data: res.data ?? [],
      columns: res.columns ?? [],
      total: res.params?.total ?? 0,
    }),
  });
  const fetchData = useCallback(() => {
    if (!params) return;
    refetch(params);
  }, [params, refetch]);
  return {
    data: data?.data ?? [],
    columns: data?.columns ?? [],
    totalRows: data?.total ?? 0,
    loading,
    error,
    fetchData,
  };
};