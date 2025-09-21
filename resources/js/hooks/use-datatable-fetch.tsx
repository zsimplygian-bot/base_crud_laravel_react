import { useEffect, useState, useMemo } from "react";
interface DateRange {
  from?: Date;
  to?: Date;
}
interface FetchOptions {
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
}: FetchOptions) => {
  const [data, setData] = useState<any[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const memoizedDateRange = useMemo(() => {
    return {
      from: dateRange?.from?.toISOString(),
      to: dateRange?.to?.toISOString(),
    };
  }, [dateRange?.from, dateRange?.to]);
  const memoizedFilterValues = useMemo(() => JSON.stringify(filterValues), [filterValues]);
  useEffect(() => {
    if (dateRange && (!memoizedDateRange.from || !memoizedDateRange.to)) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        let realView = view;
        if (typeof window !== "undefined") {
          const parts = window.location.pathname.split("/");
          if (view === "itemsimple" && parts[1] === "itemsimple" && parts[2]) {
            realView = parts[2];
          }
        }
        const params = new URLSearchParams();
        params.set("page", (pageIndex + 1).toString());
        params.set("limit", pageSize.toString());
        params.set("view", realView);
        if (sortBy) {
          params.set("sortBy", sortBy);
          params.set("sortOrder", sortOrder);
        }
        if (memoizedDateRange.from && memoizedDateRange.to) {
          params.set("from", memoizedDateRange.from);
          params.set("to", memoizedDateRange.to);
        }
        if (selectedColumn && searchTerm) {
          params.set("search", searchTerm);
          params.set("column", selectedColumn);
        }
        // Obtener todos los queryparams desde la URL
        const urlQueryParams: Record<string, string> = {};
        if (typeof window !== "undefined") {
          const searchParams = new URLSearchParams(window.location.search);
          searchParams.forEach((value, key) => {
            urlQueryParams[key] = value;
          });
        }
        // Fusionar queryparams proporcionados con los de la URL (prioriza explícitos)
        const mergedQueryParams = { ...urlQueryParams, ...queryparams };
        // Agregar los queryparams fusionados, con lógica condicional
        Object.entries(mergedQueryParams).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            // Solo permitir 'tipo' si la vista es 'itemsimple'
            if (key === "tipo" && view !== "itemsimple") return;
            params.set(key, value.toString());
          }
        });
        // Agregar filtros
        const parsedFilterValues: Record<string, string> = JSON.parse(memoizedFilterValues);
        Object.entries(parsedFilterValues).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.set(key, value);
          }
        });
        const url = `/api/index?${params.toString()}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Error fetching data: ${res.statusText}`);
        const result = await res.json();
        setData(result.data ?? []);
        setTotalRows(result.total ?? 0);
      } catch (err) {
        console.error("Error fetching data:", err);
        setData([]);
        setTotalRows(0);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [
    view,
    pageIndex,
    pageSize,
    sortBy,
    sortOrder,
    memoizedDateRange,
    selectedColumn,
    searchTerm,
    memoizedFilterValues,
    queryparams,
  ]);
  return { data, totalRows, loading };
};