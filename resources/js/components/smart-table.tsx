import { memo, useMemo, useCallback } from "react";
import { Table, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { SmartButton } from "@/components/smart-button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
type Column<T> = {
  accessor: keyof T & string;
  header: React.ReactNode;
  sortable?: boolean;
};
type Props<T> = {
  columns: Column<T>[];
  rows: T[];
  error?: string | null;
  loading?: boolean;
  columnVisibility?: Record<string, boolean>;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSortChange?: (by: string, order: "asc" | "desc") => void;
  renderCell: (accessor: string, row: T) => React.ReactNode;
  actions?: (row: T) => React.ReactNode;
  maxHeight?: string | number;
};
export const SmartTable = memo(<T extends { id: number | string }>({
  columns,rows,error,loading,columnVisibility={},sortBy,sortOrder,onSortChange,
  renderCell,actions,maxHeight="70vh",
}: Props<T>) => {
  const isVisible = useCallback(
    a => columnVisibility[a] !== false, // Controla visibilidad de columnas
    [columnVisibility]
  );
  const colSpan = useMemo(
    () => columns.filter(c => isVisible(c.accessor)).length + (actions ? 1 : 0), // Incluye acciones
    [columns,isVisible,actions]
  );
  const getIcon = useCallback(a => {
    if (sortBy !== a) return ChevronsUpDown;
    return sortOrder === "desc" ? ChevronUp : ChevronDown;
  }, [sortBy,sortOrder]);
  const handleSort = useCallback(a => {
    if (!onSortChange) return;
    onSortChange(a,sortBy === a && sortOrder === "asc" ? "desc" : "asc"); // Alterna orden
  }, [onSortChange,sortBy,sortOrder]);
  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 p-4 border rounded-md">
        <Spinner className="w-5 h-5" />
        <span>Cargando...</span>
      </div>
    );
  }
  const emptyContent = error
    ? <span className="text-red-500 font-medium">{error}</span>
    : "No hay resultados";
  return (
    <div className="rounded-md border overflow-auto" style={{ maxHeight }}>
      <Table className="w-full min-w-max">
        <thead>
          <TableRow>
            {columns.map(col =>
              !isVisible(col.accessor) ? null : (
                <TableHead key={col.accessor} className="px-2">
                  {col.sortable !== false && onSortChange ? (
                    <SmartButton
                      label={col.header}
                      icon={getIcon(col.accessor)}
                      iconPosition="right"
                      variant="ghost"
                      onClick={() => handleSort(col.accessor)}
                      className={cn(
                        "h-6 px-1 text-sm flex items-center gap-1",
                        sortBy===col.accessor && "font-semibold"
                      )}
                    />
                  ) : col.header}
                </TableHead>
              )
            )}
            {actions && (
              <TableHead className="sticky right-0 z-20 bg-background px-1 text-right" />
            )}
          </TableRow>
        </thead>
        <TableBody>
          {!rows.length ? (
            <TableRow>
              <TableCell colSpan={colSpan} className="py-6 text-center text-muted-foreground">
                {emptyContent}
              </TableCell>
            </TableRow>
          ) : rows.map(row => (
            <TableRow key={row.id}>
              {columns.map(col =>
                !isVisible(col.accessor) ? null : (
                  <TableCell
                    key={col.accessor}
                    className="px-0 pl-5 bg-background" // Empuja contenido a la derecha
                  >
                    {renderCell(col.accessor,row)}
                  </TableCell>
                )
              )}
              {actions && (
                <TableCell className="sticky right-0 z-10 bg-background px-0 text-right shadow-left">
                  {actions(row)}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
});