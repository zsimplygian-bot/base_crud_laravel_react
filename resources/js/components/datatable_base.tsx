import React, { useMemo, useCallback } from "react";
import { ActionButtons } from "./datatable_actionbuttons";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { useRenderCellContent } from "@/components/datatable_render_cell";
import { Spinner } from "@/components/ui/spinner"
interface Campo {
  title: string;
  column: string;
}
interface DataTableProps {
  campos?: Campo[];
  view: string;
  data?: any[];
  loading: boolean;
  columnVisibility?: Record<string, boolean>;
  setColumnVisibility: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  pageIndex: number;
  setPageIndex: (val: number) => void;
  pageSize: number;
  setPageSize: (val: number) => void;
  sortBy: string | null;
  setSortBy: (val: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (val: "asc" | "desc") => void;
  totalRows: number;
}
export const DataTable: React.FC<DataTableProps> = React.memo(
  ({
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
    const renderCellContent = useRenderCellContent();
    const columns = useMemo(
      () =>
        campos
          .filter((c) => c?.column)
          .map(({ title, column }) => ({ header: title, accessor: column })),
      [campos]
    );
    const visibleColumns = useMemo(
      () => columns.filter((c) => columnVisibility[c.accessor] !== false),
      [columns, columnVisibility]
    );
    const totalPages = useMemo(
      () => Math.ceil(totalRows / pageSize),
      [totalRows, pageSize]
    );
    const handleSort = useCallback(
      (column: string) => {
        if (sortBy === column) {
          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
          setSortBy(column);
          setSortOrder("asc");
        }
      },
      [sortBy, sortOrder, setSortBy, setSortOrder]
    );
    if (loading) {
      return (
        <div className="w-full border rounded-md p-2 flex items-center justify-center gap-2 text-muted-foreground">
          <Spinner className="w-5 h-5" />
          <span>Cargando datos...</span>
        </div>
      )
    }
    return (
      <div className="w-full">
        <div className="rounded-md border overflow-x-auto max-h-[560px]">
          <Table className="min-w-max w-full">
            <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 z-20 bg-white dark:bg-background font-semibold " />
              {columns
                .filter((col) => col.accessor && columnVisibility?.[col.accessor] !== false)
                .map((col) => (
                  <TableHead
                    key={col.accessor}
                    className="sticky top-0 bg-white dark:bg-background "
                  >
                    <button
                      onClick={() => handleSort(col.accessor)}
                      className={`inline-flex items-center justify-start space-x-1 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md px-2 py-1 ${
                        sortBy === col.accessor
                          ? "text-foreground font-semibold"
                          : "text-muted-foreground"
                      } hover:bg-accent hover:text-accent-foreground `}
                      style={{
                        paddingLeft: "15px",
                        position: "relative",
                        left: "-15px",
                      }}
                    >
                      <span>{col.header}</span>
                      {sortBy === col.accessor ? (
                        sortOrder === "asc" ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )
                      ) : (
                        <ChevronsUpDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </TableHead>
                ))}
            </TableRow>
          </TableHeader>
            <TableBody>
              {data.length ? (
                data.map((row, rowIndex) => (
                  <TableRow key={row.id ?? rowIndex}>
                    <TableCell className="sticky left-0 z-10 dark:bg-background">
                      <ActionButtons
                        rowId={row.id}
                        view={view}
                        queryString={window.location.search}
                      />
                    </TableCell>
                    {visibleColumns.map((col) => (
                      <TableCell key={col.accessor}>
                        {renderCellContent(col.accessor, row, view)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={visibleColumns.length + 1}
                    className="text-center py-4 text-muted-foreground"
                  >
                    No se encontraron resultados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
);