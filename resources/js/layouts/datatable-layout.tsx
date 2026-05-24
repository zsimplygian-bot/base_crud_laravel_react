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
import { SmartButton } from "@/components/smart-button"
import { PlayIcon, TrendingUpIcon } from "lucide-react" // Importamos iconos
import { useRenderCellContent } from "@/components/datatable/base/cell-renderer"
import { useDataTable } from "@/hooks/datatable/use-datatable"
import { useMemo, useCallback } from "react"

const widthMap = { "1/4": "md:w-1/4", "1/3": "md:w-1/3", "1/2": "md:w-1/2" }

export const DataTableLayout = ({ 
  view, title, icon, fields = [], footerFields, extended_form, width,
  showRFM = false, onProcessRFM, onPredictRFM // Agregamos onPredictRFM
}) => {
  
  const searchFields = useMemo(
    () => fields.filter(f => f.searchable).map(f => ({ ...f, defaultVisible: !!f.defaultVisible })),
    [fields]
  )

  const {
    pageIndex, pageSize, sortBy, sortOrder, columnVisibility, dateRange, appliedSearchValues, visibleSearchFields,
    data, columns, totalRows, loading, error, setPageIndex, setPageSize, setSortBy, setSortOrder,
    setColumnVisibility, setDateRange, setAppliedSearchValues, setVisibleSearchFields, resetAll, fetchData,
  } = useDataTable({ view, searchFields })

  const hasCreatedAt = useMemo(
    () => columns?.some(col => (col.id || col.accessor) === "created_at") ?? false,
    [columns]
  )

  const renderCell = useRenderCellContent(view)

  const onSearchApply = useCallback((v) => { 
    setAppliedSearchValues(v); 
    setPageIndex(0); 
  }, [setAppliedSearchValues, setPageIndex])

  const onDateChange = useCallback((r) => { 
    setDateRange(r); 
    setPageIndex(0); 
  }, [setDateRange, setPageIndex])

  const onSortChange = useCallback((by, order) => { 
    setSortBy(by); 
    setSortOrder(order ?? "desc") 
  }, [setSortBy, setSortOrder])

  const onNewRecordSuccess = useCallback(() => {
    setPageIndex(0)
  }, [setPageIndex])

  const renderActions = useCallback((row) => (
    <ActionButtons {...{ row_id: row.id, view, title, icon, fields, extended_form, onSuccess: fetchData, size: "sm" }} />
  ), [view, title, icon, fields, extended_form, fetchData])

  return (
    <AppLayout breadcrumbs={[{ title, href: view }]}>
      <Head {...{ title }} />
      <div className="p-4">
        <div className={width ? `w-full ${widthMap[width]}` : "w-full"}>
          <h1 className="text-lg font-semibold uppercase">LISTADO DE {title}</h1>
          
          <div className="flex flex-wrap items-center gap-2 w-full mt-2 pb-2 overflow-visible">
            <SearchFilter {...{ 
              searchFields, 
              visibleFields: visibleSearchFields, 
              setVisibleFields: setVisibleSearchFields,
              values: appliedSearchValues, 
              ssetValues: setAppliedSearchValues, 
              onApply: onSearchApply 
            }} />

            {hasCreatedAt && (
              <DateRangeFilter {...{ dateRange, setDateRange: onDateChange }} />
            )}

            <ResetFiltersButton {...{ 
              filterValues: appliedSearchValues, 
              columnVisibility, dateRange, sortBy, 
              handleResetAll: resetAll 
            }} />

            <div className="flex gap-2 ml-auto flex-shrink-0">
              <ToggleColumns {...{ columns, columnVisibility, setColumnVisibility }} />
              <ExportMenu {...{ view, columns, data }} />
              
              {showRFM ? (
                <div className="flex gap-2">
                  {/* Botón 1: Procesar RFM Histórico */}
                  <SmartButton 
                    {...{ 
                      buttonColor: "green", 
                      icons: PlayIcon,
                      variant: "default",
                      tooltip: "Recalcular RFM Actual",
                      confirmation: { 
                        title: "Confirmar Procesamiento", 
                        description: "¿Deseas recalcular la segmentación RFM con la actividad de historias clínicas?" 
                      },
                      onClick: onProcessRFM 
                    }}
                  />

                  {/* Botón 2: Proyectar con IA */}
                  <SmartButton 
                    {...{ 
                      buttonColor: "blue", 
                      icons: TrendingUpIcon,
                      variant: "default",
                      tooltip: "Proyectar con IA",
                      onClick: onPredictRFM 
                    }}
                  />
                </div>
              ) : (
                Array.isArray(fields) && fields.length > 0 && (
                  <NewRecordButton {...{ 
                    view, title, icon, fields, extended_form, 
                    onSuccess: onNewRecordSuccess 
                  }} />
                )
              )}
            </div>
          </div>

          <SmartTable {...{ 
            columns, rows: data, loading, error: error?.message ?? null,
            columnVisibility, sortBy, sortOrder, renderCell 
          }}
            onSortChange={onSortChange}
            actions={renderActions}
          />

          <DataTableFooter {...{ 
            data, totalRows, pageIndex, setPageIndex, 
            pageSize, setPageSize, footerFields 
          }} />
        </div>
      </div>
    </AppLayout>
  )
}