import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronsLeftIcon, ChevronLeftIcon, ChevronRightIcon, ChevronsRightIcon } from "lucide-react";
import { FormFieldsRenderer } from "@/components/form-fields";
import DropdownMenuBase, { DItem } from "@/components/dropdown-menu";
import { usePagination } from "@/hooks/usePagination";
import { useFooterTotals } from "@/hooks/useFooterTotals";
interface DataTableFooterProps {
  pageIndex: number;
  setPageIndex: (index: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  totalRows: number;
  data?: Record<string, any>[];
  footerFields?: Record<string, any>;
  isMobile?: boolean;
}
export const DataTableFooter: React.FC<DataTableFooterProps> = ({
  pageIndex,
  setPageIndex,
  pageSize,
  setPageSize,
  totalRows,
  data = [],
  footerFields,
  isMobile = false,
}) => {
  const formData = useFooterTotals(data, footerFields);
  const { totalPages, nav, pageSizeItems } = usePagination(totalRows, pageIndex, setPageIndex, pageSize, setPageSize);
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2">
      {/* Paginación */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 text-sm w-full sm:w-auto">
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2">
          {/* Filas por página */}
          <div className="flex items-center gap-2">
            <span>Filas:</span>
            <DropdownMenuBase
              trigger={<Button variant="outline" size="sm">{pageSize}</Button>}
              items={pageSizeItems as DItem[]}
              align="start"
            />
          </div>
          {/* Navegación */}
          <div className="flex items-center gap-1">
            {nav.map((n, i) => (
              <Button
                key={i}
                variant="outline"
                className="h-8 w-8 p-0 border border-input"
                onClick={n.fn}
                disabled={n.disable}
              >
                {n.icon ?? (
                  [<ChevronsLeftIcon />, <ChevronLeftIcon />, <ChevronRightIcon />, <ChevronsRightIcon />][i]
                )}
              </Button>
            ))}
          </div>
          {/* Info de páginas */}
          <div className="text-center sm:text-right w-full sm:w-auto">
            Página <span className="font-medium">{pageIndex + 1}</span> de <span className="font-medium">{totalPages}</span>
            <br />
            <span className="font-medium">{totalRows}</span> registros
          </div>
        </div>
      </div>
    </div>
  );
};