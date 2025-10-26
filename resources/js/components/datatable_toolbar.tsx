import React, { useRef, useState, useEffect } from "react";
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

interface DataTableToolbarProps {
  columns: { header: string; accessor: string }[];
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
  queryString?: string;
  toolbarfields?: Record<string, any>;
  filterValues?: Record<string, string>;
  setFilterValues?: (filters: Record<string, string>) => void;
  queryparams?: Record<string, any>;
  onFilterApply?: (filters: {
    selectedColumn: string | null;
    searchTerm: string | null;
    filterValues: Record<string, string>;
  }) => void;
}

export const DataTableToolbar: React.FC<DataTableToolbarProps> = ({
  columns,
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
  filterValues,
  setFilterValues,
  queryparams,
  onFilterApply,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputVisible, setInputVisible] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [localSelectedColumn, setLocalSelectedColumn] = useState<string | null>(selectedColumn);
  const [localFilterValues, setLocalFilterValues] = useState<Record<string, string>>(filterValues || {});
  const isMobile = useIsMobile();
  const { exportToCSV, exportToExcel, exportToPDF } = useDataExport(view, columns, data);

  useEffect(() => setLocalSearchTerm(searchTerm), [searchTerm]);
  useEffect(() => setLocalSelectedColumn(selectedColumn), [selectedColumn]);
  useEffect(() => setLocalFilterValues(filterValues || {}), [filterValues]);

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
    onFilterApply?.({ selectedColumn: localSelectedColumn, searchTerm: term, filterValues: localFilterValues });
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
    onFilterApply?.({ selectedColumn: null, searchTerm: null, filterValues: {} });
  };

  const formattedDateRange =
    dateRange?.from
      ? dateRange.to
        ? `${format(dateRange.from, "LLL dd, yyyy")} - ${format(dateRange.to, "LLL dd, yyyy")}`
        : format(dateRange.from, "LLL dd, yyyy")
      : "";

  const queryString = queryparams
    ? "?" + new URLSearchParams(queryparams as Record<string, string>).toString()
    : "";

  return (
    <div className="flex flex-col md:flex-row w-full justify-between gap-4 py-2">
      {/* === IZQUIERDA === */}
      <div className="flex items-center gap-2 overflow-x-auto">
        {/* Buscar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <SearchIcon className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Buscar por:</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {columns.map((col) => (
              <DropdownMenuItem
                key={col.accessor}
                onClick={() => {
                  setLocalSelectedColumn(col.accessor);
                  setInputVisible(true);
                  setTimeout(() => inputRef.current?.focus(), 50);
                }}
              >
                {col.header}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {inputVisible && (
          <div className="relative w-36">
            <Input
              ref={inputRef}
              placeholder={`Buscar ${columns.find((c) => c.accessor === localSelectedColumn)?.header || ""}`}
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleFilterClick()}
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
                <XIcon className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        {/* Nuevo */}
        <Link href={`/${view}/form/create${queryString}`}>
          <Button size="sm" variant="outline" className="gap-1 text-sm">
            <PlusIcon className="w-3 h-3" /> Nuevo
          </Button>
        </Link>

        {/* Exportar con íconos */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <DownloadIcon className="w-3 h-3" /> Exportar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Exportar:</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={exportToCSV}>
              <FileDownIcon className="w-4 h-4 text-blue-500" />
              <span className="text-blue-600">CSV</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={exportToExcel}>
              <FileSpreadsheetIcon className="w-4 h-4 text-green-600" />
              <span className="text-green-700">Excel</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={exportToPDF}>
              <FileTextIcon className="w-4 h-4 text-red-600" />
              <span className="text-red-700">PDF</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Columnas */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <EyeIcon className="w-3 h-3" /> Vista
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Columnas visibles</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {columns.map((col) => (
              <DropdownMenuCheckboxItem
                key={col.accessor}
                checked={columnVisibility[col.accessor] !== false}
                onCheckedChange={(val) => setColumnVisibility({ ...columnVisibility, [col.accessor]: val })}
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
              <CalendarIcon className="w-3 h-3" />
              <span>{formattedDateRange || "Fecha"}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={(r) => {
                setDateRange(r);
                setPageIndex(0);
              }}
              locale={es}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* === DERECHA === */}
      {toolbarfields && Object.keys(toolbarfields).length > 0 && (
        <div className="flex flex-wrap items-end gap-2 w-full md:w-auto">
          <FormFieldsRenderer
            formFields={toolbarfields}
            data={localFilterValues}
            setData={(f, v) => setLocalFilterValues((p) => ({ ...p, [f]: v }))}
            errors={{}}
            readonly={false}
            configReadonly={false}
            hiddenFields={[]}
            isMobile={isMobile}
          />
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="gap-1" onClick={handleFilterClick}>
              <SearchIcon className="w-4 h-4" />
              Filtrar
            </Button>
            <Button size="sm" variant="secondary" className="gap-1" onClick={clearFilters}>
              <EraserIcon className="w-4 h-4" />
              Limpiar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
