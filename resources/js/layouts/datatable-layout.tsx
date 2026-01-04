import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { DateRangeFilter } from "@/components/datatable/toolbar/date-range-filter";
import { SearchFilter } from "@/components/datatable/toolbar/search-filter";
import { ToggleColumns } from "@/components/datatable/toolbar/toggle-columns";
import { ExportMenu } from "@/components/datatable/toolbar/export-menu";
import { NewRecordButton } from "@/components/datatable/toolbar/new-record-button";
import { ResetFiltersButton } from "@/components/datatable/toolbar/reset-filters-button";
import { SmartTable } from "@/components/smart-table";
import { ActionButtons } from "@/components/datatable/base/action-buttons";
import { DataTableFooter } from "@/components/datatable/footer";
import { useRenderCellContent } from "@/components/datatable/base/cell-renderer";
import { useDataTable } from "@/hooks/datatable/use-datatable";
export const DataTableLayout = ({ view, title, formFields, searchFields }) => {
  const { pageIndex, pageSize, sortBy, sortOrder, columnVisibility, dateRange,
     appliedSearchValues, visibleSearchFields, data, columns, totalRows, loading, error, 
     setPageIndex, setPageSize, setSortBy, setSortOrder, setColumnVisibility, setDateRange, 
     setAppliedSearchValues, setVisibleSearchFields, resetAll } = useDataTable({ view });
  const renderCell = useRenderCellContent(view);
  return (
    <AppLayout breadcrumbs={[{ title, href: view }]}>
      <Head title={title} />
      <div className="p-4">
        <h1 className="text-lg font-semibold">LISTADO DE {title.toUpperCase()}</h1>
        <div className="flex flex-col md:flex-row w-full gap-2 mt-2 pb-2 justify-between items-start overflow-visible">
          <div className="flex flex-wrap items-start gap-2">
            <SearchFilter {...{ searchFields, visibleFields: visibleSearchFields, setVisibleFields: setVisibleSearchFields,
                values: appliedSearchValues, setValues: setAppliedSearchValues,
                onApply: filters => { setAppliedSearchValues(filters); setPageIndex(0); } }} />
            <DateRangeFilter {...{ dateRange }} setDateRange={r => { setDateRange(r); setPageIndex(0); }} />
            <ResetFiltersButton {...{ filterValues: appliedSearchValues, columnVisibility, dateRange, sortBy }} handleResetAll={resetAll} />
          </div>
          <div className="flex gap-2">
            <ToggleColumns {...{ columns, columnVisibility, setColumnVisibility }} />
            <ExportMenu {...{ view, columns, data }} />
            <NewRecordButton {...{ formFields, view }} onSuccess={() => setPageIndex(0)} />
          </div>
        </div>
        <SmartTable {...{ columns, rows: data, loading, error, columnVisibility, sortBy, sortOrder, renderCell }} 
          onSortChange={(by, order) => { setSortBy(by); setSortOrder(order ?? "desc"); }} 
          actions={row => (<ActionButtons {...{ row_id: row.id, view, formFields }} 
                    onSuccess={() => setPageIndex(0)} />)} />
        <DataTableFooter {...{ totalRows, pageIndex, setPageIndex, pageSize, setPageSize }} />
      </div>
    </AppLayout>
  );
};