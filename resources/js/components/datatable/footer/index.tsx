import { useMemo } from "react";
import { SmartDropdown } from "@/components/smart-dropdown";
import { SmartButton } from "@/components/smart-button";
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";
import { usePaginationButtons } from "@/hooks/datatable/footer/use-pagination-buttons";
import { cn } from "@/lib/utils";

const ICONS = {
  first: ChevronsLeft,
  previous: ChevronLeft,
  next: ChevronRight,
  last: ChevronsRight,
};

const TOOLTIPS = {
  first: "Primera página",
  previous: "Página anterior",
  next: "Página siguiente",
  last: "Última página",
};

const PAGE_SIZES = [10, 20, 50, 100, 250, 500];

export const DataTableFooter = ({ totalRows, pageIndex, setPageIndex, pageSize, setPageSize }) => {
  const { totalPages, buttons } = usePaginationButtons(totalRows, pageIndex, setPageIndex, pageSize);

  const sizeItems = useMemo(
    () => PAGE_SIZES.map(n => ({
      label: String(n),
      action: () => { setPageSize(n); setPageIndex(0); },
    })),
    [setPageSize, setPageIndex]
  );

  return (
    <div className="flex flex-wrap sm:flex-nowrap items-center justify-end gap-3 mt-2 text-sm text-right">
      <div className="flex items-center gap-2">
        Filas:
        <SmartDropdown items={sizeItems} triggerLabel={String(pageSize)} />
      </div>

      <div className="flex items-center gap-1">
        {buttons.map(({ type, disabled, goToPage }, i) => {
          const Icon = ICONS[type];
          return (
            <SmartButton
              key={i}
              icon={Icon}
              tooltip={TOOLTIPS[type]}
              onClick={goToPage}
              disabled={disabled}
              className={cn(disabled && "opacity-50 cursor-not-allowed")}
            />
          );
        })}
      </div>
      <div>
        Página <span className="font-medium">{pageIndex + 1}</span> de{" "}
        <span className="font-medium">{totalPages}</span>
        <br />
        <span className="font-medium">{totalRows}</span> registros
      </div>
    </div>
  );
};
