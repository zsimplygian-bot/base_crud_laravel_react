import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { DataTableToolbar } from "@/components/datatable/toolbar";
import { DataTableBase } from "@/components/datatable/base";
import { DataTableFooter } from "@/components/datatable/footer";
import { useDataTableFetch } from "@/hooks/datatable/use-datatable-fetch";
import { useDataTablePersistence } from "@/hooks/datatable/use-datatable-persistence";
import { getTitle } from "@/hooks/custom-titles";
import { useIsMobile } from "@/hooks/use-mobile";
export const DataTableLayout = ({
  view,
  toolbarfields,
  queryparams = {},
}) => {
  const isMobile = useIsMobile();
  const {
    pageIndex,
    pageSize,
    sortBy,
    sortOrder,
    columnVisibility,
    dateRange,
    selectedColumn,
    searchTerm,
    appliedSearchTerm,
    filterValues,
    isRestored,
    setPageIndex,
    setPageSize,
    setSortBy,
    setSortOrder,
    setColumnVisibility,
    setDateRange,
    setSelectedColumn,
    setSearchTerm,
    setAppliedSearchTerm,
    setFilterValues,
    handleResetAll,
  } = useDataTablePersistence(view, queryparams);
  const { data, columns, totalRows, loading } = useDataTableFetch({
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
  const displayTitle = getTitle(view);
  return (
    <AppLayout breadcrumbs={[{ title: displayTitle, href: view }]}>
      {/* Solo aquí en mayúsculas */}
      <Head title={displayTitle} />
      <div className="p-4">
        <h1 className="text-lg font-semibold">
          LISTADO DE {displayTitle.toUpperCase()}
        </h1>
        <DataTableToolbar
          {...{
            columns,
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
            sortBy,
          }}
        />
        <DataTableBase
          {...{
            columns,
            view,
            data,
            loading,
            columnVisibility,
            sortBy,
            setSortBy,
            sortOrder,
            setSortOrder,
          }}
        />
        <DataTableFooter
          {...{ pageIndex, setPageIndex, pageSize, setPageSize, totalRows, }}
        />
      </div>
    </AppLayout>
  );
};