import { useState, useMemo, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { PlusIcon,} from "lucide-react";
import { SearchFilter } from "@/components/datatable/toolbar/search-filter";
import { ToggleColumns } from "@/components/datatable/toolbar/toggle-columns";
import { ExportMenu } from "@/components/datatable/toolbar/export-menu";
import { DateRangeFilter } from "@/components/datatable/toolbar/date-range-filter";
import { useDataExport } from "@/hooks/use-datatable-export";
import { FormFieldsRenderer } from "@/components/form-fields";
import { TableFiltersButtons } from "./clear-filters";
const parseFilters = () =>
  typeof window !== "undefined"
    ? Object.fromEntries(new URLSearchParams(window.location.search))
    : {};
export function DataTableToolbar({
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
  filterValues = parseFilters(),
  setFilterValues,
  queryparams,
}) {
  const isMobile = useIsMobile();
  const columns = useMemo(() => campos.map(c => ({ header: c.title, accessor: c.column })), [campos]);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || "");
  const [localSelectedColumn, setLocalSelectedColumn] = useState(selectedColumn);
  const [localFilterValues, setLocalFilterValues] = useState(filterValues);
  useEffect(() => setLocalFilterValues(filterValues), [filterValues]);
  const { exportToCSV, exportToExcel, exportToPDF } = useDataExport(view, columns, data);
  const queryString = queryparams ? `?${new URLSearchParams(queryparams).toString()}` : "";
  const handleFilterClick = () => {
  const term = localSearchTerm?.trim() || null;
  setSelectedColumn(localSelectedColumn);
  setAppliedSearchTerm(term);
  setFilterValues?.(localFilterValues);
  setPageIndex(0);
  const url = new URL(window.location.href);
  Object.entries(localFilterValues).forEach(([k, v]) =>
    v ? url.searchParams.set(k, v) : url.searchParams.delete(k)
  );
  window.history.replaceState({}, "", url.toString());
};
  return (
    <div className="flex flex-col md:flex-row w-full justify-between gap-4 py-2">
      <div className="flex items-center gap-2 overflow-x-auto">
        <SearchFilter
          columns={columns}
          localSelectedColumn={localSelectedColumn}
          setLocalSelectedColumn={setLocalSelectedColumn}
          localSearchTerm={localSearchTerm}
          setLocalSearchTerm={setLocalSearchTerm}
          onSearch={handleFilterClick} // <-- aquí
        />
        <Link href={`/${view}/form/create${queryString}`}>
          <Button size="sm" variant="outline" className="gap-1 text-sm">
            <PlusIcon className="w-3 h-3 opacity-60 hover:opacity-100 transition" /> Nuevo
          </Button>
        </Link>
        <ExportMenu exportToCSV={exportToCSV} exportToExcel={exportToExcel} exportToPDF={exportToPDF} />
        <ToggleColumns columns={columns} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} />
        <DateRangeFilter dateRange={dateRange} setDateRange={r => { setDateRange(r); setPageIndex(0); }} />
      </div>
      {toolbarfields && Object.keys(toolbarfields).length > 0 && (
        <div className="flex flex-wrap items-end gap-2 w-full md:w-auto">
          <FormFieldsRenderer
            formFields={toolbarfields}
            data={localFilterValues}
            setData={(f, v) => setLocalFilterValues(p => ({ ...p, [f]: v }))}
            errors={{}}
            readonly={false}
            hiddenFields={[]}
            isMobile={isMobile}
          />
          <TableFiltersButtons
            localSearchTerm={localSearchTerm}
            setLocalSearchTerm={setLocalSearchTerm}
            localSelectedColumn={localSelectedColumn}
            setLocalSelectedColumn={setLocalSelectedColumn}
            localFilterValues={localFilterValues}
            setLocalFilterValues={setLocalFilterValues}
            setAppliedSearchTerm={setAppliedSearchTerm}
            setSelectedColumn={setSelectedColumn}
            setFilterValues={setFilterValues}
            setPageIndex={setPageIndex}
            dateRange={dateRange}
            setDateRange={setDateRange}
            queryparams={queryparams}
          />
        </div>
      )}
    </div>
  );
}