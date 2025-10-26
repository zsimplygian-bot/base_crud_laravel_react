import React, { useState, useEffect, useMemo, useRef } from "react";
import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { DataTableToolbar } from "@/components/datatable_toolbar";
import { DataTable } from "@/components/datatable";
import { DataTableFooter } from "@/components/datatable_footer";
import { useDataTableFetch } from "@/hooks/use-datatable-fetch";
import { useIsMobile } from "@/hooks/use-mobile";
interface Campo { title: string; column: string; }
interface DataTableLayoutProps {
  title: string;
  custom_title: string;
  view: string;
  campos: Campo[];
  width_index?: string;
  toolbarfields?: Record<string, any>;
  footerFields?: Record<string, any>;
  queryparams?: Record<string, any>;
}
const getFiltersFromUrl = (): Record<string, string> => {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
};
export const DataTableLayout: React.FC<DataTableLayoutProps> = ({
  title,
  custom_title,
  view,
  campos: initialCampos,
  width_index,
  toolbarfields,
  footerFields,
  queryparams: initialQueryParams,
}) => {
  const isMobile = useIsMobile();
  const [campos, setCampos] = useState(initialCampos);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>();
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearchTerm, setAppliedSearchTerm] = useState<string | null>(null);
  const [filterValues, setFilterValues] = useState<Record<string, string>>(
    initialQueryParams && Object.keys(initialQueryParams).length
      ? initialQueryParams
      : getFiltersFromUrl()
  );
  const isFirstSync = useRef(true);
  // Sincroniza filtros con URL
  useEffect(() => {
    if (typeof window === "undefined" || isFirstSync.current) {
      isFirstSync.current = false;
      return;
    }
    const url = new URL(window.location.href);
    Object.entries(filterValues).forEach(([k, v]) => v && url.searchParams.set(k, v));
    window.history.replaceState(null, "", url.toString());
  }, [filterValues]);
  useEffect(() => setCampos(initialCampos), [initialCampos]);
  const columns = useMemo(() => campos.map(c => ({ header: c.title, accessor: c.column })), [campos]);
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
    return data.reduce((acc, row) => {
      Object.keys(footerFields).forEach(k => {
        const val = parseFloat(row[k]);
        if (!isNaN(val)) acc[k] = (acc[k] || 0) + val;
      });
      return acc;
    }, {} as Record<string, number>);
  }, [data, footerFields]);
  const widthClasses: Record<string, string> = { "w-1/2": "sm:w-1/2", "w-2/3": "sm:w-2/3", "w-full": "sm:w-full" };
  return (
    <AppLayout breadcrumbs={[{ title, href: view }]}>
      <Head title={title} />
      <div className="flex h-full flex-1 flex-col rounded-xl p-4">
        <h1 className="font-semibold mb-0">LISTADO DE {custom_title.toUpperCase()}</h1>
        <div className="overflow-x-auto w-full sm:w-[1580px] px-0 sm:px-4 md:px-0">
          <div className={`w-full ${widthClasses[width_index ?? "w-full"]}`}>
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
      </div>
    </AppLayout>
  );
};