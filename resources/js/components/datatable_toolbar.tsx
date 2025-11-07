import React, { useRef, useState, useEffect, useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Link } from "@inertiajs/react";
import {
  PlusIcon,
  CalendarIcon,
  XIcon,
  EyeIcon,
  DownloadIcon,
  SearchIcon,
  FileTextIcon,
  FileSpreadsheetIcon,
  FileDownIcon,
  EraserIcon,
} from "lucide-react";
import { es } from "date-fns/locale";
import { format } from "date-fns";
import { useDataExport } from "@/hooks/use-datatable-export";
import { FormFieldsRenderer } from "@/components/form-fields";
const getFiltersFromUrl = (): Record<string, string> =>
  typeof window === "undefined"
    ? {}
    : Object.fromEntries(new URLSearchParams(window.location.search));
interface Campo {
  title: string;
  column: string;
}
interface DataTableToolbarProps {
  campos: Campo[];
  selectedColumn: string | null;
  setSelectedColumn: (col: string | null) => void;
  searchTerm: string;
  setAppliedSearchTerm: (term: string | null) => void;
  setPageIndex: (page: number) => void;
  dateRange?: { from?: Date; to?: Date };
  setDateRange: (range?: { from?: Date; to?: Date }) => void;
  columnVisibility: Record<string, boolean>;
  setColumnVisibility: (visibility: Record<string, boolean>) => void;
  data: any[];
  view: string;
  toolbarfields?: Record<string, any>;
  filterValues?: Record<string, string>;
  setFilterValues?: (filters: Record<string, string>) => void;
  queryparams?: Record<string, any>;
}
export const DataTableToolbar: React.FC<DataTableToolbarProps> = ({
  campos,
  selectedColumn,
  setSelectedColumn,
  searchTerm,
  setAppliedSearchTerm,
  setPageIndex,
  dateRange,
  setDateRange,
  columnVisibility,
  setColumnVisibility,
  data,
  view,
  toolbarfields,
  filterValues = getFiltersFromUrl(),
  setFilterValues,
  queryparams,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  const columns = useMemo(
    () => campos.map(c => ({ header: c.title, accessor: c.column })),
    [campos]
  );
  const [inputVisible, setInputVisible] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [localSelectedColumn, setLocalSelectedColumn] = useState<string | null>(selectedColumn);
  const [localFilterValues, setLocalFilterValues] = useState<Record<string, string>>(filterValues);
  const { exportToCSV, exportToExcel, exportToPDF } = useDataExport(view, columns, data);
  useEffect(() => setLocalSearchTerm(searchTerm), [searchTerm]);
  useEffect(() => setLocalSelectedColumn(selectedColumn), [selectedColumn]);
  useEffect(() => setLocalFilterValues(filterValues), [filterValues]);
  const updateQueryParams = (params: Record<string, any>) => {
    const url = new URL(window.location.href);
    Object.entries(params).forEach(([k, v]) =>
      v ? url.searchParams.set(k, String(v)) : url.searchParams.delete(k)
    );
    window.history.replaceState({}, "", url.toString());
  };
  const handleFilterClick = () => {
    const term = localSearchTerm.trim() || null;
    setSelectedColumn(localSelectedColumn);
    setAppliedSearchTerm(term);
    setFilterValues?.(localFilterValues);
    setPageIndex(0);
    updateQueryParams({ ...(queryparams || {}), ...localFilterValues });
  };
  const clearFilters = () => {
    setLocalSearchTerm("");
    setLocalSelectedColumn(null);
    setLocalFilterValues({});
    setDateRange(undefined);
    setAppliedSearchTerm(null);
    setSelectedColumn(null);
    setFilterValues?.({});
    setPageIndex(0);
    window.history.replaceState({}, "", window.location.pathname);
  };
  const formattedDateRange = useMemo(
    () =>
      dateRange?.from
        ? dateRange.to
          ? `${format(dateRange.from, "LLL dd, yyyy")} - ${format(dateRange.to, "LLL dd, yyyy")}`
          : format(dateRange.from, "LLL dd, yyyy")
        : "",
    [dateRange]
  );
  const queryString = useMemo(() => {
    if (!queryparams) return "";
    const q = new URLSearchParams(queryparams as Record<string, string>).toString();
    return q ? "?" + q : "";
  }, [queryparams]);
  const hasActiveFilters = useMemo(
    () => Object.values(localFilterValues).some(v => v && v.trim() !== ""),
    [localFilterValues]
  );
  const canFilter = hasActiveFilters;
  return (
    <div className="flex flex-col md:flex-row w-full justify-between gap-4 py-2">
      {/* IZQUIERDA */}
      <div className="flex items-center gap-2 overflow-x-auto">
        {/* Buscar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <SearchIcon className="w-4 h-4 opacity-60 hover:opacity-100 transition" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Buscar por:</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {columns.map(col => (
              <DropdownMenuItem
                key={col.accessor}
                onClick={() => {
                  setLocalSelectedColumn(col.accessor);
                  setInputVisible(true);
                  setTimeout(() => inputRef.current?.focus(), 50);
                }}
              >
                {col.header.toUpperCase()}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {inputVisible && (
          <div className="relative w-36">
            <Input
              ref={inputRef}
              placeholder={`Buscar ${columns.find(c => c.accessor === localSelectedColumn)?.header.toLowerCase() || ""}`}
              value={localSearchTerm}
              onChange={e => setLocalSearchTerm(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleFilterClick()}
              className="text-sm"
            />
            {localSearchTerm && (
              <button
                type="button"
                onClick={() => {
                  setLocalSearchTerm("");
                  setLocalSelectedColumn(null);
                  setInputVisible(false);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <XIcon className="w-3 h-3 opacity-60 hover:opacity-100 transition" />
              </button>
            )}
          </div>
        )}
        {/* Nuevo */}
        <Link href={`/${view}/form/create${queryString}`}>
          <Button size="sm" variant="outline" className="gap-1 text-sm">
            <PlusIcon className="w-3 h-3 opacity-60 hover:opacity-100 transition" /> Nuevo
          </Button>
        </Link>
        {/* Exportar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <DownloadIcon className="w-3 h-3 opacity-60 hover:opacity-100 transition" /> Exportar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Exportar:</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={exportToCSV}>
              <FileDownIcon className="w-4 h-4 opacity-60 hover:opacity-100 transition" /> CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={exportToExcel}>
              <FileSpreadsheetIcon className="w-4 h-4 opacity-60 hover:opacity-100 transition" /> Excel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={exportToPDF}>
              <FileTextIcon className="w-4 h-4 opacity-60 hover:opacity-100 transition" /> PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Columnas */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <EyeIcon className="w-3 h-3 opacity-60 hover:opacity-100 transition" /> Vista
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Columnas visibles</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {columns.map(col => (
              <DropdownMenuCheckboxItem
                key={col.accessor}
                checked={columnVisibility[col.accessor] !== false}
                onCheckedChange={val =>
                  setColumnVisibility({ ...columnVisibility, [col.accessor]: val })
                }
              >
                {col.header}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Calendario */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <CalendarIcon className="w-3 h-3 opacity-60 hover:opacity-100 transition" />
              <span>{formattedDateRange || "Fecha"}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={r => {
                setDateRange(r);
                setPageIndex(0);
              }}
              locale={es}
            />
          </PopoverContent>
        </Popover>
      </div>
      {/* DERECHA */}
      {toolbarfields && Object.keys(toolbarfields).length > 0 && (
        <div className="flex flex-wrap items-end gap-2 w-full md:w-auto">
          <FormFieldsRenderer
            formFields={toolbarfields}
            data={localFilterValues}
            setData={(f, v) => setLocalFilterValues(p => ({ ...p, [f]: v }))}
            errors={{}}
            readonly={false}
            configReadonly={false}
            hiddenFields={[]}
            isMobile={isMobile}
          />
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleFilterClick} disabled={!canFilter}>
              <SearchIcon className="w-4 h-4 opacity-60 hover:opacity-100 transition" /> Filtrar
            </Button>
            <Button size="sm" variant="secondary" onClick={clearFilters} disabled={!canFilter}>
              <EraserIcon className="w-4 h-4 opacity-60 hover:opacity-100 transition" /> Limpiar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};