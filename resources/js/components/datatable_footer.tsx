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
  footerFields?: Record<string, { label: string; width?: number }>;
  isMobile?: boolean;
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
  isMobile,
}) => {
  const pageSizes = [10, 25, 50, 100, 250, 1000];

  const navButtons = [
    {
      icon: <ChevronsLeftIcon className="w-3.5 h-3.5 text-foreground" />,
      action: () => setPageIndex(0),
      disabled: pageIndex === 0,
    },
    {
      icon: <ChevronLeftIcon className="w-3.5 h-3.5 text-foreground" />,
      action: () => setPageIndex(pageIndex - 1),
      disabled: pageIndex === 0,
    },
    {
      icon: <ChevronRightIcon className="w-3.5 h-3.5 text-foreground" />,
      action: () => setPageIndex(pageIndex + 1),
      disabled: pageIndex >= totalPages - 1,
    },
    {
      icon: <ChevronsRightIcon className="w-3.5 h-3.5 text-foreground" />,
      action: () => setPageIndex(totalPages - 1),
      disabled: pageIndex >= totalPages - 1,
    },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
      {/* Extras del toolbar */}
      <div className="order-1 sm:order-1 w-full sm:max-w-[65%] overflow-x-auto">
        <div className="flex gap-2 flex-nowrap whitespace-nowrap min-w-fit">
          <ToolbarExtras
            view={view}
            acumulado={acumulado}
            footerFields={footerFields}
            isMobile={isMobile}
          />
        </div>
      </div>

      {/* Controles de paginación */}
      <div className="order-2 sm:order-2 w-full sm:w-auto flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4 text-left sm:text-right">
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 justify-between sm:justify-end">
          {/* Select de tamaño de página */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Filas por página:</span>
            <div className="w-24">
              <Select
                value={String(pageSize)}
                onValueChange={(val) => {
                  setPageSize(Number(val));
                  setPageIndex(0);
                }}
              >
                <SelectTrigger id="pageSize" className="w-full h-8 text-sm">
                  <SelectValue>{pageSize}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {pageSizes.map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Botones de navegación */}
          <div className="flex items-center gap-1">
            {navButtons.map((b, i) => (
              <Button
                key={i}
                variant="outline"
                className="h-7 w-7 p-0 border border-input"
                onClick={b.action}
                disabled={b.disabled}
              >
                {b.icon}
              </Button>
            ))}
          </div>
        </div>

        {/* Información de página */}
        <div className="text-sm text-muted-foreground text-center sm:text-right sm:flex-shrink-0">
          Página{" "}
          <span className="font-medium text-foreground">{pageIndex + 1}</span> de{" "}
          <span className="font-medium text-foreground">{totalPages}</span>
          <br />
          <span className="font-medium text-foreground">{totalRows}</span> registros
          en total.
        </div>
      </div>
    </div>
  );
};
