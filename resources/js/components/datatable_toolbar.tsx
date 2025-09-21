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
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Link } from "@inertiajs/react";
import {
  PlusIcon,
  CalendarIcon,
  XIcon,
  EyeIcon,
  DownloadIcon,
  SearchIcon,
} from "lucide-react";
import { es } from "date-fns/locale";
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
  queryString,
  toolbarfields,
  filterValues,
  setFilterValues,
  queryparams,
  onFilterApply,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedColumnTemp = useRef<string | null>(null);
  const [inputVisible, setInputVisible] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [localSelectedColumn, setLocalSelectedColumn] = useState<string | null>(null);
  const [localFilterValues, setLocalFilterValues] = useState<Record<string, string>>(filterValues || {});
  const isMobile = useIsMobile();
  // Sincronizar props con estados locales
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);
  useEffect(() => {
    setLocalSelectedColumn(selectedColumn);
  }, [selectedColumn]);
  useEffect(() => {
    setLocalFilterValues(filterValues || {});
  }, [filterValues]);
  // Log para depuración
  useEffect(() => {
    if (queryparams && Object.keys(queryparams).length > 0) {
      updateQueryParams(queryparams);
    }
  }, [queryparams]);
  const handleLocalFilterChange = (key: string, value: string) => {
    setLocalFilterValues((prev) => ({ ...prev, [key]: value }));
  };
  const updateQueryParams = (params: Record<string, string | number | null | undefined>) => {
    const url = new URL(window.location.href);
    Object.entries(params).forEach(([key, value]) => {
      if (value != null && value !== "") {
        url.searchParams.set(key, String(value));
      } else {
        url.searchParams.delete(key);
      }
    });
    window.history.replaceState({}, "", url.toString());
  };
  const handleFilterClick = () => {
    setSelectedColumn(localSelectedColumn);
    const finalSearchTerm = localSearchTerm.trim() !== "" ? localSearchTerm : null;
    setAppliedSearchTerm(finalSearchTerm);
    setPageIndex(0);
    setFilterValues?.(localFilterValues);
    const updatedParams = {
      ...(queryparams || {}),
      ...localFilterValues,
    };
    updateQueryParams(updatedParams);
    if (onFilterApply) {
      onFilterApply({
        selectedColumn: localSelectedColumn,
        searchTerm: finalSearchTerm,
        filterValues: localFilterValues,
      });
    }
  };
  const { exportToCSV, exportToExcel, exportToPDF } = useDataExport(view, columns, data);
  const handleColumnVisibilityChange = (column: string, isVisible: boolean) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [column]: isVisible,
    }));
  };
  const formattedDateRange = dateRange?.from
    ? dateRange.to
      ? `${format(dateRange.from, "LLL dd, yyyy")} - ${format(dateRange.to, "LLL dd, yyyy")}`
      : format(dateRange.from, "LLL dd, yyyy")
    : "";
  // Construir query string desde queryparams para el botón Nuevo
  const queryStringFromParams = queryparams
    ? "?" + new URLSearchParams(queryparams as Record<string, string>).toString()
    : "";
  return (
    <div className="flex flex-col md:flex-row w-full justify-between gap-4 py-2">
      {/* Grupo Izquierdo */}
      <div
        className="flex items-center gap-2 whitespace-nowrap overflow-x-auto"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {/* Buscar por columna */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <SearchIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            onCloseAutoFocus={(e) => {
              e.preventDefault();
              setTimeout(() => {
                inputRef.current?.focus();
              }, 50);
            }}
          >
            <DropdownMenuLabel>Buscar según:</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {columns.map((col) => (
              <DropdownMenuItem
                key={col.accessor}
                onClick={() => {
                  selectedColumnTemp.current = col.accessor;
                  setInputVisible(true);
                  setLocalSelectedColumn(col.accessor);
                }}
              >
                {col.header}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Input búsqueda */}
        {inputVisible && (
          <div className="relative w-40 flex-shrink-0">
            <Input
              ref={inputRef}
              placeholder={`Buscar ${
                columns.find((c) => c.accessor === localSelectedColumn)?.header.toLowerCase() || ""
              }`}
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleFilterClick();
                }
              }}
            />
            {localSearchTerm && (
              <button
                type="button"
                onClick={() => {
                  setLocalSearchTerm("");
                  setLocalSelectedColumn(null);
                  setInputVisible(false);
                  selectedColumnTemp.current = null;
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <XIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
        {/* Botón Nuevo */}
        {!["honora", "pagomen", "consultasan"].includes(view) && (
          <Link href={`/${view}/form/create${queryStringFromParams}`}>
            <Button variant="outline" className="flex items-center gap-2">
              <PlusIcon className="w-4 h-4" />
              Nuevo
            </Button>
          </Link>
        )}
        {/* Exportar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="default">
              <DownloadIcon />
              Exportar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Exportar a:</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={exportToCSV}>📄 CSV</DropdownMenuItem>
            <DropdownMenuItem onClick={exportToExcel}>📊 Excel</DropdownMenuItem>
            <DropdownMenuItem onClick={exportToPDF}>📕 PDF</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Columnas visibles */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="default">
              <EyeIcon />
              Vista
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Columnas visibles</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {columns.map((col) => (
              <DropdownMenuCheckboxItem
                key={col.accessor}
                checked={columnVisibility[col.accessor] !== false}
                onCheckedChange={(val) => handleColumnVisibilityChange(col.accessor, val)}
                onSelect={(e) => e.preventDefault()}
              >
                {col.header}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Calendario */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="default"
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <CalendarIcon className="w-4 h-4" />
              <span>{formattedDateRange || "Fecha"}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={(range) => {
                setDateRange(range);
                setPageIndex(0);
              }}
              initialFocus
              locale={es}
            />
          </PopoverContent>
        </Popover>
      </div>
      {/* Grupo derecho (Filtros avanzados) */}
      <div className="flex flex-wrap items-end gap-4 w-full md:w-auto">
        {toolbarfields && Object.keys(toolbarfields).length > 0 && (
          <>
            <FormFieldsRenderer
              formFields={toolbarfields}
              data={localFilterValues}
              setData={(f, v) => handleLocalFilterChange(f, v)}
              errors={{}}
              readonly={false}
              configReadonly={false}
              hiddenFields={[]}
              isMobile={isMobile}
            />
            <Button
              variant="outline"
              className="whitespace-nowrap h-10 self-end"
              onClick={handleFilterClick}
            >
              Filtrar
            </Button>
          </>
        )}
      </div>
    </div>
  );
};