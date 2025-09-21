import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";
import { ToolbarExtras } from "@/hooks/use-footbar-extra";
interface DataTableFooterProps {
  pageIndex: number;
  setPageIndex: (index: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  totalPages: number;
  totalRows: number;
  view: string;
  acumulado?: Record<string, number>;
  footerFields?: Record<string, { label: string; width?: number }>; // <-- Agregar aquí
}
export const DataTableFooter: React.FC<DataTableFooterProps> = ({
  pageIndex,
  setPageIndex,
  pageSize,
  setPageSize,
  totalPages,
  totalRows,
  view,
  acumulado,
  footerFields,
  isMobile
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
      {/* 1. ToolbarExtras con scroll horizontal y ancho máximo para no empujar */}
      <div className="order-1 sm:order-1 w-full sm:max-w-[65%] overflow-x-auto">
  <div className="flex-nowrap whitespace-nowrap min-w-fit flex gap-2">
    <ToolbarExtras view={view} acumulado={acumulado} footerFields={footerFields} isMobile={isMobile}  />
  </div>
</div>
      {/* 2. Controles de navegación y página */}
      <div className="order-2 sm:order-2 w-full sm:w-auto flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4 text-left sm:text-right">
        {/* Select + navegación */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 justify-between sm:justify-end">
          {/* Select */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground dark:text-muted-foreground">
              Filas por página:
            </span>
            <div className="w-24">
              <Select
                value={String(pageSize)}
                onValueChange={(val) => {
                  setPageSize(Number(val));
                  setPageIndex(0);
                }}
              >
                <SelectTrigger id="pageSize" className="w-full">
                  <SelectValue>{pageSize}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {[10, 25, 100, 250].map((option) => (
                    <SelectItem key={option} value={String(option)}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Botones de navegación */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="border border-input"
              onClick={() => setPageIndex(0)}
              disabled={pageIndex === 0}
            >
              <ChevronsLeftIcon className="w-4 h-4 text-foreground" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="border border-input"
              onClick={() => setPageIndex(pageIndex - 1)}
              disabled={pageIndex === 0}
            >
              <ChevronLeftIcon className="w-4 h-4 text-foreground" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="border border-input"
              onClick={() => setPageIndex(pageIndex + 1)}
              disabled={pageIndex >= totalPages - 1}
            >
              <ChevronRightIcon className="w-4 h-4 text-foreground" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="border border-input"
              onClick={() => setPageIndex(totalPages - 1)}
              disabled={pageIndex >= totalPages - 1}
            >
              <ChevronsRightIcon className="w-4 h-4 text-foreground" />
            </Button>
          </div>
        </div>
        {/* Info de página */}
        <div className="text-sm text-muted-foreground text-center sm:text-right  sm:flex-shrink-0">

          Página <span className="font-medium text-foreground">{pageIndex + 1}</span> de{" "}
          <span className="font-medium text-foreground">{totalPages}</span>
          <br />
          <span className="font-medium text-foreground">{totalRows}</span> registros en total.
        </div>
      </div>
    </div>
  );
};