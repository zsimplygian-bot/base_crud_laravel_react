import { useMemo, useEffect, useState, useRef } from "react";
import { SmartDropdown } from "@/components/smart-dropdown";
import { SmartButton } from "@/components/smart-button";
import { Input } from "@/components/ui/input"; 
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";
const ICONS = { first: ChevronsLeft, previous: ChevronLeft, next: ChevronRight, last: ChevronsRight };
const TOOLTIPS = { first: "Primera página", previous: "Página anterior", next: "Página siguiente", last: "Última página" };
const PAGE_SIZES = [10, 20, 50, 100, 250, 500];
export const DataTableFooter = ({ 
  totalRows, 
  pageIndex, 
  setPageIndex, 
  pageSize, 
  setPageSize 
}) => {
  const [pageInput, setPageInput] = useState(pageIndex + 1);
  const [customSize, setCustomSize] = useState("");
  const appliedPageRef = useRef(pageIndex + 1);

  useEffect(() => {
    const current = pageIndex + 1;
    appliedPageRef.current = current;
    setPageInput(current);
  }, [pageIndex]);

  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const lastPage = totalPages - 1;

  const safeSetPage = page => {
    if (page < 0 || page > lastPage) return;
    setPageIndex(page);
  };

  const applyPageInput = () => {
    const v = Number(pageInput);
    if (isNaN(v) || v === appliedPageRef.current) return;
    const clamped = Math.min(Math.max(v, 1), totalPages);
    appliedPageRef.current = clamped;
    safeSetPage(clamped - 1);
  };

  const buttons = [
    { type: "first", disabled: pageIndex === 0, goToPage: () => safeSetPage(0) },
    { type: "previous", disabled: pageIndex === 0, goToPage: () => safeSetPage(pageIndex - 1) },
    { type: "next", disabled: pageIndex >= lastPage, goToPage: () => safeSetPage(pageIndex + 1) },
    { type: "last", disabled: pageIndex >= lastPage, goToPage: () => safeSetPage(lastPage) },
  ];

  const sizeItems = useMemo(
    () =>
      PAGE_SIZES.map(n => ({
        label: String(n),
        action: () => {
          setPageSize(n);
          setPageIndex(0);
        },
      })),
    [setPageSize, setPageIndex]
  );

  return (
    <div className="flex flex-wrap sm:flex-nowrap items-center justify-end gap-4 mt-2 text-sm">
      <div className="flex items-center gap-2">
        Filas: <SmartDropdown {...{ 
              triggerLabel: String(pageSize), 
              labelExtra: (
                <Input 
                  type="number" 
                  value={customSize} 
                  onChange={e => setCustomSize(e.target.value)}
                  onKeyDown={e => { 
                    e.stopPropagation();
                    if (e.key !== "Enter") return;
                    const v = Number(customSize);
                    if (isNaN(v) || v < 1 || v === pageSize) return;
                    setPageSize(v);
                    setPageIndex(0);
                  }} 
                  className="w-24"
                />
              ), 
              items: sizeItems, 
            }} />
      </div>
      <div className="flex items-center gap-1">
        {buttons.map(({ type, disabled, goToPage }, i) => {
          const Icon = ICONS[type];
          return ( <SmartButton key={i} {...{ icons: Icon, tooltip: TOOLTIPS[type],
                onClick: goToPage, disabled, className: cn(disabled && "opacity-50 cursor-not-allowed"),  }} />
          );
        })}
      </div>
      <div className="flex items-center gap-1 text-right">
        Página <Input type="number" min={1} max={totalPages} value={pageInput}
          onChange={e => setPageInput(e.target.value)} onKeyDown={e => e.key === "Enter" && applyPageInput()}
          className="w-15 "
        />
        de <span className="font-medium">{totalPages}</span>
        <br />
        <div className="text-right leading-tight border-l pl-4">
        <div className="font-bold tabular-nums">{totalRows}</div>
        <div className="text-[12px] text-muted-foreground uppercase">Registros</div>
      </div>
      </div>
    </div>
  );
};