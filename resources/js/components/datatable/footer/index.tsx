// components/datatable/footer/footer.tsx
import React, { useState } from "react";
import { PageSizeSelector } from "./page-size-selector";
import { PaginationButtons } from "./pagination-buttons";
interface Props {
  pageIndex: number;
  setPageIndex: (v: number) => void;
  pageSize: number;
  setPageSize: (v: number) => void;
  totalRows: number;
}
export const DataTableFooter: React.FC<Props> = ({
  pageIndex,
  setPageIndex,
  pageSize,
  setPageSize,
  totalRows,
}) => {
  const [totalPages, setTotalPages] = useState(1);
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 text-sm w-full sm:w-auto">
        <PageSizeSelector {...{ pageSize, setPageSize, setPageIndex }} />
        <PaginationButtons {...{totalRows, pageIndex, setPageIndex, pageSize, onTotalPages: setTotalPages,}}/>
        <div className="text-center sm:text-right w-full sm:w-auto">
          Página <span className="font-medium">{pageIndex + 1}</span> de{" "}
          <span className="font-medium">{totalPages}</span>
          <br />
          <span className="font-medium">{totalRows}</span> registros
        </div>
      </div>
    </div>
  );
};