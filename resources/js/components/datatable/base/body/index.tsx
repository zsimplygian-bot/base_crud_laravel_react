import React, { useMemo } from "react";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ActionButtons } from "./action-buttons";
import { useRenderCellContent } from "./render_cell";
interface DataTableBodyProps {
  rows: any[];
  visibleColumns: any[];
  view: string;
}
export const DataTableBody: React.FC<DataTableBodyProps> = ({
  rows = [],
  visibleColumns,
  view,
}) => {
  const render = useRenderCellContent();
  const memoVisibleColumns = useMemo(() => visibleColumns, [visibleColumns]);
  if (!rows || rows.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={memoVisibleColumns.length + 1} className="text-center py-4 text-muted-foreground">
            No hay resultados
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }
  return (
    <TableBody>
      {rows.map(row => (
        <TableRow key={row.id}>
          <TableCell className="sticky left-0 z-10 bg-background">
            <ActionButtons row_id={row.id} view={view} />
          </TableCell>
          {memoVisibleColumns.map(col => (
            <TableCell key={col.accessor}>
              {render(col.accessor, row, view)}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
};