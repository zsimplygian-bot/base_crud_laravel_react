import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { SearchFilter } from "./search-filter";
import { ToggleColumns } from "./toggle-columns";
import { ExportMenu } from "./export-menu";
import { DateRangeFilter } from "./date-range-filter";
import { FormFieldsRenderer } from "@/components/form/form-fields";
import { TableFiltersButtons } from "./clear-filters";
import { NewRecordButton } from "./new-record-button";
import { ResetFiltersButton } from "./reset-filters-button";
export function DataTableToolbar({
  columns = [],
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
  filterValues = {},
  setFilterValues,
  handleResetAll,
  sortBy,
}) {
  const isMobile = useIsMobile();
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || "");
  const [localSelectedColumn, setLocalSelectedColumn] = useState(selectedColumn);
  const [localFilterValues, setLocalFilterValues] = useState(filterValues);
  // Sincroniza solo los filtros de toolbarfields
  useEffect(() => setLocalFilterValues(filterValues), [filterValues]);
  // Buscar
  const handleFilterClick = () => {
    const term = localSearchTerm.trim() || null;
    setSelectedColumn(localSelectedColumn);
    setAppliedSearchTerm(term);
    setPageIndex(0);
  };
  return (
    <div className="flex flex-col md:flex-row w-full justify-between gap-4 py-2">
      {/* IZQUIERDA */}
      <div className="flex items-center gap-2 overflow-x-auto">
        <SearchFilter {...{columns, localSelectedColumn, setLocalSelectedColumn, localSearchTerm,
          setLocalSearchTerm, onSearch:handleFilterClick}}/>
        <NewRecordButton {...{ view }}/>
        <ExportMenu {...{view, columns, data}}/>
        <ToggleColumns {...{columns, columnVisibility, setColumnVisibility}}/>
        <DateRangeFilter dateRange={dateRange} setDateRange={(r) => { setDateRange(r); setPageIndex(0); }} />
        <ResetFiltersButton {...{localSearchTerm, localSelectedColumn, dateRange, localFilterValues,
          columnVisibility, pageIndex, pageSize, sortBy, handleResetAll}}/>
      </div>
      {/* DERECHA → botones que solo aplican toolbarfields */}
      {toolbarfields && Object.keys(toolbarfields).length > 0 && (
        <div className="flex flex-wrap items-end gap-2 w-full md:w-auto">
          <FormFieldsRenderer
            formFields={toolbarfields}
            data={localFilterValues}
            setData={(field, value) =>
              setLocalFilterValues((p) => ({ ...p, [field]: value }))
            }
            errors={{}}
            readonly={false}
            hiddenFields={[]}
            isMobile={isMobile}
          />
          <TableFiltersButtons {...{ localFilterValues, setFilterValues, setPageIndex, }} />
        </div>
      )}
    </div>
  );
}