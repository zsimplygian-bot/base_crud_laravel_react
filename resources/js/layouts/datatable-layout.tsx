import React, { useState, useEffect, useMemo, useRef } from "react";
import { DataTableToolbar } from "@/components/datatable_toolbar";
import { DataTable } from "@/components/datatable";
import { DataTableFooter } from "@/components/datatable_footer";
import { useDataTableFetch } from "@/hooks/use-datatable-fetch";
import { useIsMobile } from "@/hooks/use-mobile";
interface Campo {
  title: string;
  column: string;
}
interface DataTableLayoutProps {
  view: string;
  width_index?: string;
  campos: Campo[];
  toolbarfields?: Record<string, any>;
  footerFields?: Record<string, any>;
  queryparams?: Record<string, any>;
}
// 🔍 Extrae filtros de la URL
const getFiltersFromUrl = (): Record<string, string> => {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const allowed = ["id_tipo_liquid", "id_mes", "id_ano", "id_estado_liquid", "id_pfildelegado", "id_provincia"]; // Puedes extender esta lista
  const filters: Record<string, string> = {};
  for (const key of allowed) {
    const value = params.get(key);
    if (value) filters[key] = value;
  }
  return filters;
};
export const DataTableLayout: React.FC<DataTableLayoutProps> = ({
  view,
  width_index,
  campos: initialCampos,
  toolbarfields,
  footerFields,
  queryparams: initialQueryParams,
}) => {
  const isMobile = useIsMobile();
  const [campos, setCampos] = useState<Campo[]>(initialCampos);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>();
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearchTerm, setAppliedSearchTerm] = useState<string | null>(null);
  // Inicializamos filterValues desde queryparams prop o URL
  const [filterValues, setFilterValues] = useState<Record<string, string>>(
    () => initialQueryParams && Object.keys(initialQueryParams).length > 0
      ? initialQueryParams
      : getFiltersFromUrl()
  );
  // Flag para ignorar la primera sincronización de URL y evitar doble fetch
  const isFirstSync = useRef(true);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isFirstSync.current) {
      // Ignorar la primera sincronización al montar
      isFirstSync.current = false;
      return;
    }
    // Sincronizar filtro con URL sin recargar ni disparar otro fetch innecesario
    const url = new URL(window.location.href);
    const allowed = ["id_tipo_liquid", "id_mes", "id_ano", "id_estado_liquid", "id_pfildelegado", "id_provincia"];
    // Limpia los params permitidos
    allowed.forEach((key) => url.searchParams.delete(key));
    // Añade los filtros actuales
    Object.entries(filterValues).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, value.toString());
      }
    });
    // Reemplaza el estado sin recargar página
    window.history.replaceState(null, "", url.toString());
  }, [filterValues]);
  useEffect(() => {
    setCampos(initialCampos);
  }, [initialCampos]);
  const columns = useMemo(() =>
    campos.map(({ title, column }) => ({
      header: title,
      accessor: column,
    })), [campos]
  );
  // Pasamos filterValues como queryparams para que hook haga fetch con filtros
  const { data, totalRows, loading } = useDataTableFetch({
    view,
    pageIndex,
    pageSize,
    sortBy,
    sortOrder,
    dateRange,
    selectedColumn,
    searchTerm: appliedSearchTerm,
    filterValues,
    queryparams: filterValues,
  });
  const acumulado = useMemo(() => {
    if (!footerFields) return {};
    const keysToSum = Object.keys(footerFields);
    return data.reduce((acc, row) => {
      keysToSum.forEach((key) => {
        const value = parseFloat(row[key]);
        if (!isNaN(value)) acc[key] = (acc[key] || 0) + value;
      });
      return acc;
    }, {} as Record<string, number>);
  }, [data, footerFields]);
  const widthClasses: Record<string, string> = {
    "w-1/2": "sm:w-1/2",
    "w-2/3": "sm:w-2/3",
    "w-full": "sm:w-full",
  };
  const appliedWidthClass = widthClasses[width_index ?? "w-full"];
  return (
    <div className="w-full flex justify-left">
      <div className={`w-full ${appliedWidthClass}`}>
        <DataTableToolbar
          columns={columns}
          selectedColumn={selectedColumn}
          setSelectedColumn={setSelectedColumn}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setAppliedSearchTerm={setAppliedSearchTerm}
          setPageIndex={setPageIndex}
          dateRange={dateRange}
          setDateRange={setDateRange}
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
          data={data}
          view={view}
          toolbarfields={toolbarfields}
          filterValues={filterValues}
          setFilterValues={setFilterValues}
          queryparams={filterValues}
        />
        <div className="overflow-x-auto max-w-full">
          <DataTable
            campos={campos}
            view={view}
            data={data}
            loading={loading}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
            pageIndex={pageIndex}
            setPageIndex={setPageIndex}
            pageSize={pageSize}
            setPageSize={setPageSize}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            totalRows={totalRows}
          />
        </div>
        <DataTableFooter
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          pageSize={pageSize}
          setPageSize={setPageSize}
          totalPages={Math.ceil(totalRows / pageSize)}
          totalRows={totalRows}
          view={view}
          acumulado={acumulado}
          footerFields={footerFields}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
};
