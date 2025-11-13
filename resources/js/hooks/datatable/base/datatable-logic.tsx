import { useMemo, useCallback } from "react";
interface Campo {
  title: string;
  column: string;
}
export const useDataTableLogic = (
  campos: Campo[],
  view: string,
  data: any[],
  loading: boolean,
  columnVisibility: Record<string, boolean>,
  pageSize: number,
  sortBy: string | null,
  setSortBy: (v: string) => void,
  sortOrder: "asc" | "desc",
  setSortOrder: (v: "asc" | "desc") => void,
  totalRows: number
) => {
  const columns = useMemo(
    () => campos.filter(c => c?.column).map(c => ({ header: c.title, accessor: c.column })),
    [campos]
  );
  const visibleColumns = useMemo(
    () => columns.filter(c => columnVisibility[c.accessor] !== false),
    [columns, columnVisibility]
  );
  const totalPages = useMemo(() => Math.ceil(totalRows / pageSize), [totalRows, pageSize]);
  const handleSort = useCallback(
    (col: string) => {
      sortBy === col ? setSortOrder(sortOrder === "asc" ? "desc" : "asc") : (setSortBy(col), setSortOrder("asc"));
    },
    [sortBy, sortOrder, setSortBy, setSortOrder]
  );
  return useMemo(
    () => ({ columns, visibleColumns, totalPages, handleSort, data, loading, view }),
    [columns, visibleColumns, totalPages, handleSort, data, loading, view]
  );
};