import React from "react";
import { TableHead, TableRow } from "@/components/ui/table";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
interface DataTableHeaderProps {
  columns: any[];
  visibleColumns: Record<string, boolean>;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (accessor: string) => void;
}
export const DataTableHeader: React.FC<DataTableHeaderProps> = ({
  columns,
  visibleColumns,
  sortBy,
  sortOrder,
  onSort,
}) => (
  <thead>
    <TableRow>
      {/* Columna de acciones */}
      <TableHead className="sticky left-0 z-20 bg-background font-semibold" />
      {columns.map(col =>
        visibleColumns[col.accessor] === false ? null : (
          <TableHead key={col.accessor} className="sticky top-0 bg-background">
            <button
              onClick={() => onSort(col.accessor)}
              className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors
                ${sortBy === col.accessor ? "text-foreground font-semibold" : "text-muted-foreground"}
                hover:bg-accent hover:text-accent-foreground`}
              style={{ paddingLeft: 15, position: "relative", left: -15 }}
            >
              {col.header}
              {sortBy === col.accessor ? (
                sortOrder === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronsUpDown className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          </TableHead>
        )
      )}
    </TableRow>
  </thead>
);