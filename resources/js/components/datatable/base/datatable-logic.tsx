import React from "react";
import { ActionButtons } from "./action-buttons";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { useRenderCellContent } from "@/components/datatable/base/render_cell";
import { Spinner } from "@/components/ui/spinner";
import { useDataTableLogic } from "@/hooks/datatable/base/datatable-logic";
interface Campo { title: string; column: string; }
interface DataTableProps {
  campos?: Campo[];
  view: string;
  data?: any[];
  loading: boolean;
  columnVisibility?: Record<string, boolean>;
  pageSize: number;
  sortBy: string | null;
  setSortBy: (v: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (v: "asc" | "desc") => void;
  totalRows: number;
}
export const DataTable = React.memo<DataTableProps>(({
  campos = [],
  view,
  data = [],
  loading,
  columnVisibility = {},
  pageSize,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  totalRows,
}) => {
  const render = useRenderCellContent();
  const { columns, visibleColumns, handleSort, data: rows, loading: isLoading, view: v } = useDataTableLogic(
    campos, view, data, loading, columnVisibility, pageSize, sortBy, setSortBy, sortOrder, setSortOrder, totalRows
  );
  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 p-4 text-muted-foreground border rounded-md">
        <Spinner className="w-5 h-5" />
        <span>Cargando...</span>
      </div>
    );
  }
  return (
    <div className="rounded-md border overflow-x-auto max-h-[560px]">
      <Table className="w-full min-w-max">
        <TableHeader>
          <TableRow>
            <TableHead className="sticky left-0 z-20 bg-background font-semibold" />
            {columns.map(col => columnVisibility[col.accessor] === false ? null : (
              <TableHead key={col.accessor} className="sticky top-0 bg-background">
                <button
                  onClick={() => handleSort(col.accessor)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors
                    ${sortBy === col.accessor ? "text-foreground font-semibold" : "text-muted-foreground"}
                    hover:bg-accent hover:text-accent-foreground`}
                  style={{ paddingLeft: 15, position: "relative", left: -15 }}
                >
                  {col.header}
                  {sortBy === col.accessor
                    ? sortOrder === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    : <ChevronsUpDown className="w-4 h-4 text-muted-foreground" />
                  }
                </button>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length ? rows.map((row, i) => (
            <TableRow key={row.id ?? i}>
              <TableCell className="sticky left-0 z-10 bg-background">
                <ActionButtons row_id={row.id} view={v}/>
              </TableCell>
              {visibleColumns.map(col => (
                <TableCell key={col.accessor}>
                  {render(col.accessor, row, v)}
                </TableCell>
              ))}
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={visibleColumns.length + 1} className="text-center py-4 text-muted-foreground">
                No hay resultados
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
});