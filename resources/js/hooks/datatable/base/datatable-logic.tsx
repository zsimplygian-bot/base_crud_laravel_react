import { useMemo, useCallback } from "react";
interface ColumnDef {
  header: string;
  accessor: string;
}
interface DataTableLogicProps {
  columnsInput: ColumnDef[];
  view: string;
  data: any[];
  loading: boolean;
  columnVisibility: Record<string, boolean>;
  sortBy: string;
  setSortBy: (col: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
}
export const useDataTableLogic = (props: DataTableLogicProps) => {
  const { columnsInput, columnVisibility, sortBy, sortOrder, setSortBy, setSortOrder } = props;
  const columns = useMemo(() => columnsInput, [columnsInput]);
  const visibleColumns = useMemo(
    () => columns.filter(c => columnVisibility?.[c.accessor] !== false),
    [columns, columnVisibility]
  );
  const handleSort = useCallback(
    (col: string) => {
      if (sortBy === col) {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
        setSortBy(col);
        setSortOrder("asc");
      }
    },
    [sortBy, sortOrder, setSortBy, setSortOrder]
  );
  return { ...props, columns, visibleColumns, handleSort };
};