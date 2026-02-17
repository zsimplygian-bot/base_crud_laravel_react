// components/datatable/layout/data-table-layout.tsx
import { Head } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { DateRangeFilter } from "@/components/datatable/toolbar/date-range-filter"
import { SearchFilter } from "@/components/datatable/toolbar/search-filter"
import { ToggleColumns } from "@/components/datatable/toolbar/toggle-columns"
import { ExportMenu } from "@/components/datatable/toolbar/export-menu"
import { NewRecordButton } from "@/components/datatable/toolbar/new-record-button"
import { ResetFiltersButton } from "@/components/datatable/toolbar/reset-filters-button"
import { SmartTable } from "@/components/smart-table"
import { ActionButtons } from "@/components/datatable/base/action-buttons"
import { DataTableFooter } from "@/components/datatable/footer"
import { useRenderCellContent } from "@/components/datatable/base/cell-renderer"
import { useDataTable } from "@/hooks/datatable/use-datatable"
import { useMemo } from "react"

const widthMap = {
  "1/4": "md:w-1/4",
  "1/3": "md:w-1/3",
  "1/2": "md:w-1/2",
}

export const DataTableLayout = ({
  view,
  title,
  fields = [], // ← BLINDAJE
  footerFields,
  extendedFields,
  width,
}) => {
  // Deriva searchFields desde config
  const searchFields = useMemo(
    () =>
      fields
        .filter(f => f.searchable)
        .map(f => ({
          ...f,
          defaultVisible: !!f.defaultVisible,
        })),
    [fields]
  )

  const {
    pageIndex,
    pageSize,
    sortBy,
    sortOrder,
    columnVisibility,
    dateRange,
    appliedSearchValues,
    visibleSearchFields,
    data,
    columns,
    totalRows,
    loading,
    error,
    setPageIndex,
    setPageSize,
    setSortBy,
    setSortOrder,
    setColumnVisibility,
    setDateRange,
    setAppliedSearchValues,
    setVisibleSearchFields,
    resetAll,
    fetchData, // Refresca sin cambiar página
  } = useDataTable({ view, searchFields })

  const renderCell = useRenderCellContent(view)

  return (
    <AppLayout breadcrumbs={[{ title, href: view }]}>
      <Head {...{ title }} />
      <div className="p-4">
        <div className={width ? `w-full ${widthMap[width]}` : "w-full"}>
          <h1 className="text-lg font-semibold">
            LISTADO DE {title.toUpperCase()}
          </h1>

          <div className="flex flex-wrap items-center gap-2 w-full mt-2 pb-2 overflow-visible">
            <SearchFilter
              {...{
                searchFields,
                visibleFields: visibleSearchFields,
                setVisibleFields: setVisibleSearchFields,
                values: appliedSearchValues,
                setValues: setAppliedSearchValues,
                onApply: filters => {
                  setAppliedSearchValues(filters)
                  setPageIndex(0) // Reset solo al filtrar
                },
              }}
            />

            <DateRangeFilter
              {...{
                dateRange,
                setDateRange: r => {
                  setDateRange(r)
                  setPageIndex(0) // Reset solo al filtrar
                },
              }}
            />

            <ResetFiltersButton
              {...{
                filterValues: appliedSearchValues,
                columnVisibility,
                dateRange,
                sortBy,
              }}
              handleResetAll={resetAll}
            />

            <div className="flex gap-2 ml-auto flex-shrink-0">
              <ToggleColumns
                {...{ columns, columnVisibility, setColumnVisibility }}
              />
              <ExportMenu {...{ view, columns, data }} />
              <NewRecordButton
                {...{ view, title, fields }}
                onSuccess={() => setPageIndex(0)} // Crear sí reinicia página
              />
            </div>
          </div>

          <SmartTable
            {...{
              columns,
              rows: data,
              loading,
              error: error?.message ?? null, // Error → string
              columnVisibility,
              sortBy,
              sortOrder,
              renderCell,
            }}
            onSortChange={(by, order) => {
              setSortBy(by)
              setSortOrder(order ?? "desc")
            }}
            actions={row => (
              <ActionButtons
                {...{
                  row_id: row.id,
                  view,
                  title,
                  fields,
                  extendedFields,
                }}
                onSuccess={fetchData}
              />
            )}
          />

          <DataTableFooter
            {...{
              data,
              totalRows,
              pageIndex,
              setPageIndex,
              pageSize,
              setPageSize,
              footerFields,
            }}
          />
        </div>
      </div>
    </AppLayout>
  )
}
