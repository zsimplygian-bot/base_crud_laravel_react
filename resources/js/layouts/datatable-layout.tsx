import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { DataTableToolbar } from "@/components/datatable/toolbar/toolbar";
import { DataTable } from "@/components/datatable/base/datatable-logic";
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
  const STORAGE_KEY = `datatable_state_${view}`;
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
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
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
    setIsRestored(true);
  }, []);
  const { data, totalRows, loading, refetch } = useDataTableFetch({
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
    isRestored,
  });
  const handleResetAll = () => {
    localStorage.removeItem(STORAGE_KEY);
    setPageIndex(0);
    setPageSize(10);
    setSortBy(null);
    setSortOrder("desc");
    setColumnVisibility({});
    setDateRange({});
    setSelectedColumn(null);
    setSearchTerm("");
    setAppliedSearchTerm(null);
    setFilterValues({});
    setIsRestored(true);
  };
  return (
    <AppLayout breadcrumbs={[{ title, href: view }]}>
      <Head title={title} />
      <div className="p-4">
        <h1 className="text-lg font-semibold">
          LISTADO DE {custom_title.toUpperCase()}
        </h1>
        <DataTableToolbar
          {...{
            campos,
            selectedColumn,
            setSelectedColumn,
            searchTerm,
            setAppliedSearchTerm,
            setPageIndex,
            pageIndex,
            pageSize,
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
            handleResetAll,
            sortBy, // <-- importante
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
    </AppLayout>
  );
};