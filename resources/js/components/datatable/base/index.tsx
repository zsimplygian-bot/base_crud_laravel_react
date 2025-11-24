import React, { useMemo, useCallback } from "react";
import { Table } from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import { useDataTableLogic } from "@/hooks/datatable/base/datatable-logic";
import { DataTableHeader } from "@/components/datatable/base/header";
import { DataTableBody } from "@/components/datatable/base/body";
export const DataTableBase = React.memo((props) => {
  const {
    columns,
    view,
    data,
    loading,
    columnVisibility,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
  } = props;
  const {
    columns: normalizedColumns,
    visibleColumns,
    handleSort,
    data: rows,
    loading: isLoading,
    view: v,
  } = useDataTableLogic({
    columnsInput: columns,
    view,
    data,
    loading,
    columnVisibility,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
  });
  const onSort = useCallback((accessor: string) => handleSort(accessor), [handleSort]);
  const memoVisibleColumns = useMemo(() => visibleColumns, [visibleColumns]);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 p-4 text-muted-foreground border rounded-md">
        <Spinner className="w-5 h-5" />
        <span>Cargando...</span>
      </div>
    );
  }
  return (
    <div className="rounded-md border overflow-x-auto max-h-[560px]">
      <Table className="w-full min-w-max">
        <DataTableHeader
          {...{
            columns: normalizedColumns,
            visibleColumns: columnVisibility,
            sortBy,
            sortOrder,
            onSort,
          }}
        />
        <DataTableBody
          {...{
            rows,
            visibleColumns: memoVisibleColumns,
            view: v,
          }}
        />
      </Table>
    </div>
  );
});