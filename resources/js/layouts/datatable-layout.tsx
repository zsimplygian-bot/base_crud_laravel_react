import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { DataTableToolbar } from "@/components/datatable/toolbar/toolbar";
import { DataTable } from "@/components/datatable/base/base";
import { DataTableFooter } from "@/components/datatable/footer/footer";
import { useDataTableFetch } from "@/hooks/use-datatable-fetch";
import { useIsMobile } from "@/hooks/use-mobile";
export const DataTableLayout = ({
  title,
  custom_title,
  view,
  campos,
  width_index = "w-full",
  toolbarfields,
  footerFields,
  queryparams = {},
}) => {
  const isMobile = useIsMobile();
  const storageKey = `datatable_state_${view}`;
  const [isRestored, setIsRestored] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [columnVisibility, setColumnVisibility] = useState({});
  const [dateRange, setDateRange] = useState({});
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearchTerm, setAppliedSearchTerm] = useState<string | null>(null);
  const [filterValues, setFilterValues] = useState(queryparams);
  // Restaurar solo una vez
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const s = JSON.parse(saved);
      setPageIndex(s.pageIndex ?? 0);
      setPageSize(s.pageSize ?? 10);
      setSortBy(s.sortBy ?? null);
      setSortOrder(s.sortOrder ?? "asc");
      setColumnVisibility(s.columnVisibility ?? {});
      setDateRange(s.dateRange ?? {});
      setSelectedColumn(s.selectedColumn ?? null);
      setAppliedSearchTerm(s.searchTerm ?? null);
      setFilterValues(s.filterValues ?? {});
    }
    setIsRestored(true); // ← ahora sí se puede hacer fetch
  }, []);
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
    isRestored, // NUEVO
  });
  return (
    <AppLayout breadcrumbs={[{ title, href: view }]}>
      <Head title={title} />
      <div className="p-4">
        <h1 className="text-lg font-semibold">LISTADO DE {custom_title.toUpperCase()}</h1>
        <DataTableToolbar
            {...{
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
              filterValues,
              setFilterValues,
              queryparams: filterValues,
            }}
          />
        <DataTable
              {...{
                campos,
                view,
                data,
                loading,
                columnVisibility,
                setColumnVisibility,
                pageIndex,
                setPageIndex,
                pageSize,
                setPageSize,
                sortBy,
                setSortBy,
                sortOrder,
                setSortOrder,
                totalRows,
              }}
            />
        <DataTableFooter
          {...{
            pageIndex,
            setPageIndex,
            pageSize,
            setPageSize,
            totalRows,
            view,
            data,
            footerFields,
            isMobile,
          }}
        />
      </div>
      <div className="mt-4 p-4 border-t text-xs">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
    <div>
      <strong>Vista:</strong> {view} <br />
      <strong>Restaurado:</strong> {isRestored ? "Sí" : "No"} <br />
      <strong>Página actual:</strong> {pageIndex + 1} <br />
      <strong>Filas por página:</strong> {pageSize} <br />
      <strong>Total filas:</strong> {totalRows} <br />
      
    </div>
    <div>
      <strong>Ordenar por:</strong> {sortBy ?? "id"} <br />
      <strong>Dirección sort:</strong> {sortOrder} <br />
      <strong>Cargando:</strong> {loading ? "Sí" : "No"} <br />
      <strong>Columnas visibles:</strong> <br />
      <pre className="whitespace-pre-wrap break-words">{JSON.stringify(columnVisibility, null, 2)}</pre>
      <strong>Date range:</strong> <br />
      <pre className="whitespace-pre-wrap break-words">{JSON.stringify(dateRange, null, 2)}</pre>
      
    </div>
    <div>
      <strong>Columna seleccionada (búsqueda):</strong> {selectedColumn ?? "-"} <br />
      <strong>Valor aplicado de búsqueda:</strong> {appliedSearchTerm ?? "-"} <br />
      <strong>Valores de filtros:</strong> <br />
      <pre className="whitespace-pre-wrap break-words">{JSON.stringify(filterValues, null, 2)}</pre>
      <strong>Query params:</strong> <br />
      <pre className="whitespace-pre-wrap break-words">{JSON.stringify(queryparams, null, 2)}</pre>
    </div>
  </div>
</div>

    </AppLayout>
  );
};