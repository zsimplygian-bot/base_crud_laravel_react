import React from "react";
import { ActionButtons } from "./datatable_actionbuttons";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from "lucide-react";
import { useRenderCellContent } from "@/components/datatable_render_cell";
interface Campo {
  title: string;
  column: string;
}
interface DataTableProps {
  campos?: Campo[];
  view: string;
  data?: any[];
  loading: boolean;
  columnVisibility?: { [key: string]: boolean };
  setColumnVisibility: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean }>
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
export const DataTable: React.FC<DataTableProps> = ({
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
  const totalPages = Math.ceil(totalRows / pageSize);
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };
  const columns = campos
    .filter((campo) => campo && typeof campo.column === "string")
    .map((campo) => ({
      header: campo.title,
      accessor: campo.column,
    }));
  return (
    <div className="w-full">
      <div className="rounded-md border overflow-x-auto max-h-[545px]">
        <Table className="min-w-max w-full bg-white dark:bg-gray-900">
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 z-20 bg-white dark:bg-background font-semibold bg-white dark:bg-gray-900" />
              {columns
                .filter((col) => col.accessor && columnVisibility?.[col.accessor] !== false)
                .map((col) => (
                  <TableHead
                    key={col.accessor}
                    className="sticky top-0 bg-white dark:bg-background bg-white dark:bg-gray-900"
                  >
                    <button
                      onClick={() => handleSort(col.accessor)}
                      className={`inline-flex items-center justify-start space-x-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md px-3 py-2 ${
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
            {loading ? (
              <>
                <TableRow>
                  <TableCell colSpan={(columns?.length ?? 0) + 1} className="pt-6 pb-2">
                    <Progress value={70} className="w-1/2 mx-auto" />
                  </TableCell>
                </TableRow>
                <TableRow />
              </>
            ) : data.length > 0 ? (
              data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  <TableCell className="sticky left-0 z-10 dark:bg-background bg-white dark:bg-gray-900">
                    <ActionButtons
                      rowId={row.id}
                      view={view}
                      queryString={window.location.search}
                    />
                  </TableCell>
                  {columns
                    .filter((col) => col.accessor && columnVisibility?.[col.accessor] !== false)
                    .map((col) => {
                      const content = renderCellContent(col.accessor, row, view);
                      return (
                        <TableCell key={col.accessor}>
                          {content}
                        </TableCell>
                      );
                    })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={(columns?.length ?? 0) + 1}
                  className="text-center py-4"
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
};