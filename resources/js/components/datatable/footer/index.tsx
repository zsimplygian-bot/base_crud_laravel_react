import { useMemo, useEffect, useState, useRef } from "react";
import { SmartDropdown } from "@/components/smart-dropdown";
import { SmartButton } from "@/components/smart-button";
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";
const ICONS = { first: ChevronsLeft, previous: ChevronLeft, next: ChevronRight, last: ChevronsRight };
const TOOLTIPS = { first: "Primera página", previous: "Página anterior", next: "Página siguiente", last: "Última página" };
const PAGE_SIZES = [10, 20, 50, 100, 250, 500];
export const DataTableFooter = ({ data = [], totalRows, pageIndex, setPageIndex, pageSize, setPageSize, footerFields, }) => {
  const [ready, setReady] = useState(false);
  const [pageInput, setPageInput] = useState(pageIndex + 1);
  const [customSize, setCustomSize] = useState("");
  const appliedPageRef = useRef(pageIndex + 1);
  useEffect(() => {
    if (!data.length) return;
    setReady(false);
    const t = setTimeout(() => setReady(true), 1000);
    return () => clearTimeout(t);
  }, [data]);
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
  const footerValues = useMemo(() => {
    if (!ready) return {};
    const values = {};
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
      {footerFields?.fields?.map(f => (
        <div key={f.id} className="text-right">
          <div className="text-xs text-muted-foreground">{f.label}</div>
          <div className="font-medium">
            {f.sum ? ready ? footerValues[f.id]?.toLocaleString() : "—" : totalRows}
          </div>
        </div>
      ))}
      <div className="flex items-center gap-2">
        Filas: <SmartDropdown {...{ triggerLabel: String(pageSize), label: (
              <> {" "} <input type="number" min={1} value={customSize} onChange={e => setCustomSize(e.target.value)}
                  onKeyDown={e => { e.stopPropagation();
                    if (e.key !== "Enter") return;
                    const v = Number(customSize);
                    if (isNaN(v) || v < 1 || v === pageSize) return;
                    setPageSize(v);
                    setPageIndex(0);
                  }} onClick={e => e.stopPropagation()}  className="w-25 h-7 border rounded-full text-sm text-center"
                />
              </>
            ), items: sizeItems, }} />
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
        Página <input type="number" min={1} max={totalPages} value={pageInput}
          onChange={e => setPageInput(e.target.value)} onKeyDown={e => e.key === "Enter" && applyPageInput()}
          className="w-12 h-7 text-center border rounded-full text-sm"
        />
        de <span className="font-medium">{totalPages}</span>
        <br />
        <span className="font-medium text-gray-400">{totalRows} registros</span>
      </div>
    </div>
  );
};