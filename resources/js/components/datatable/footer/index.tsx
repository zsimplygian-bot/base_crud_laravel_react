import { useMemo, useEffect, useState } from "react";
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

export const DataTableFooter = ({
  data = [],
  totalRows,
  pageIndex,
  setPageIndex,
  pageSize,
  setPageSize,
  footerFields,
}) => {
  const { totalPages, buttons } = usePaginationButtons(
    totalRows,
    pageIndex,
    setPageIndex,
    pageSize
  );

  const [ready, setReady] = useState(false);

  // ⏱️ Espera 1 segundo cuando llegue data
  useEffect(() => {
    if (!data.length) return;
    setReady(false);
    const t = setTimeout(() => setReady(true), 1000);
    return () => clearTimeout(t);
  }, [data]);

  const sizeItems = useMemo(
    () =>
      PAGE_SIZES.map(n => ({
        label: String(n),
        action: () => { setPageSize(n); setPageIndex(0); },
      })),
    [setPageSize, setPageIndex]
  );

  const footerValues = useMemo(() => {
    if (!ready) return {};
    const values: Record<string, number> = {};
    footerFields?.fields?.forEach(f => {
      if (!f.sum) return;
      values[f.id] = data.reduce((acc, row) => {
        const v = f.accessor ? f.accessor(row) : Number(row[f.id]);
        return acc + (isNaN(v) ? 0 : v);
      }, 0);
    });
    return values;
  }, [data, footerFields, ready]);

  return (
    <div className="flex flex-wrap sm:flex-nowrap items-center justify-end gap-4 mt-2 text-sm">
      {/* Footer dinámico */}
      {footerFields?.fields?.map(f => (
        <div key={f.id} className="text-right">
          <div className="text-xs text-muted-foreground">{f.label}</div>
          <div className="font-medium">
            {f.sum
              ? ready
                ? footerValues[f.id]?.toLocaleString()
                : "—"
              : totalRows}
          </div>
        </div>
      ))}

      <div className="flex items-center gap-2">
        Filas:
        <SmartDropdown {...{ items: sizeItems, triggerLabel: String(pageSize) }} />
      </div>

      <div className="flex items-center gap-1">
        {buttons.map(({ type, disabled, goToPage }, i) => {
          const Icon = ICONS[type];
          return (
            <SmartButton
              key={i}
              {...{
                icon: Icon,
                tooltip: TOOLTIPS[type],
                onClick: goToPage,
                disabled,
                className: cn(disabled && "opacity-50 cursor-not-allowed"),
              }}
            />
          );
        })}
      </div>

      <div className="text-right">
        Página <span className="font-medium">{pageIndex + 1}</span> de{" "}
        <span className="font-medium">{totalPages}</span>
        <br />
        <span className="font-medium">{totalRows}</span> registros
      </div>
    </div>
  );
};
