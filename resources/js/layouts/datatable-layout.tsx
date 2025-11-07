import React, { useState, useEffect, useRef } from "react";
import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { DataTableToolbar } from "@/components/datatable_toolbar";
import { DataTable } from "@/components/datatable_base";
import { DataTableFooter } from "@/components/datatable_footer";
import { useDataTableFetch } from "@/hooks/use-datatable-fetch";
import { useIsMobile } from "@/hooks/use-mobile";
interface Campo {
  title: string;
  column: string;
}
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
export const DataTableLayout: React.FC<DataTableLayoutProps> = ({
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
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>();
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearchTerm, setAppliedSearchTerm] = useState<string | null>(null);
  const [filterValues, setFilterValues] = useState<Record<string, string>>(queryparams);
  const firstSync = useRef(true);
  // sincroniza filtros en la URL sin provocar render extra
  useEffect(() => {
    if (typeof window === "undefined" || firstSync.current) {
      firstSync.current = false;
      return;
    }
    const url = new URL(window.location.href);
    url.search = new URLSearchParams(filterValues).toString();
    window.history.replaceState(null, "", url.toString());
  }, [filterValues]);
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
  const widthClasses: Record<string, string> = {
    "w-1/2": "sm:w-1/2",
    "w-2/3": "sm:w-2/3",
    "w-full": "sm:w-full",
  };
  return (
    <AppLayout breadcrumbs={[{ title, href: view }]}>
      <Head title={title} />
      <div className="flex flex-col h-full rounded-xl p-4">
        <h1 className="text-lg font-semibold">LISTADO DE {custom_title.toUpperCase()}</h1>
        <div className={`overflow-x-auto ${widthClasses[width_index]}`}>
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
          <div className="overflow-x-auto max-w-full">
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
          </div>
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
      </div>
    </AppLayout>
  );
};