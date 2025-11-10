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

  const memoizedDateRange = useMemo(
    () => ({
      from: dateRange?.from?.toISOString(),
      to: dateRange?.to?.toISOString(),
    }),
    [dateRange?.from, dateRange?.to]
  );

  const memoizedFilters = useMemo(() => JSON.stringify(filterValues), [filterValues]);

  useEffect(() => {
    if (dateRange && (!memoizedDateRange.from || !memoizedDateRange.to)) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        let realView = view;

        const params = new URLSearchParams({
          page: (pageIndex + 1).toString(),
          limit: pageSize.toString(),
          view: realView,
        });

        if (sortBy) {
          params.set("sortBy", sortBy);
          params.set("sortOrder", sortOrder);
        }

        if (memoizedDateRange.from && memoizedDateRange.to) {
          params.set("from", memoizedDateRange.from);
          params.set("to", memoizedDateRange.to);
        }

        if (selectedColumn && searchTerm) {
          params.set("column", selectedColumn);
          params.set("search", searchTerm);
        }

        const urlParams: Record<string, string> = {};
        if (typeof window !== "undefined") {
          new URLSearchParams(window.location.search).forEach((v, k) => {
            urlParams[k] = v;
          });
        }

        const merged = { ...urlParams, ...queryparams };

        Object.entries(merged).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== "") params.set(k, v.toString());
        });

        const parsedFilters = JSON.parse(memoizedFilters);
        Object.entries(parsedFilters).forEach(([k, v]) => {
          if (v) params.set(k, v);
        });

        const url = `/api/index?${params.toString()}`;

        // ÚNICO LOG COMPLETO:
        console.log("[DATA FETCH]", {
          url,
          view,
          pageIndex,
          pageSize,
          sortBy,
          sortOrder,
          dateRange: memoizedDateRange,
          selectedColumn,
          searchTerm,
          filterValues: parsedFilters,
          queryparams,
          mergedParams: merged,
        });

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Error fetching data: ${res.statusText}`);

        const result = await res.json();
        setData(result.data ?? []);
        setTotalRows(result.total ?? 0);
      } catch (err) {
        console.error("[DATA FETCH ERROR]", err);
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
    memoizedFilters,
    queryparams,
  ]);

  return { data, totalRows, loading };
};
