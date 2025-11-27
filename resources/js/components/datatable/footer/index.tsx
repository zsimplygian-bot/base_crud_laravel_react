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
  pageIndex, setPageIndex, pageSize, setPageSize, totalRows,
}) => {
  const [totalPages, setTotalPages] = useState(1);
  return (
    <div className="flex flex-row items-center gap-3 mt-2 flex-wrap sm:flex-nowrap text-sm">
      <PageSizeSelector {...{ pageSize, setPageSize, setPageIndex }} />
      <div className="flex-shrink-0">
        <PaginationButtons {...{totalRows, pageIndex, setPageIndex, pageSize, onTotalPages: setTotalPages,}}/>
      </div>
      <div>
          Página <span className="font-medium">{pageIndex + 1}</span> de{" "}
          <span className="font-medium">{totalPages}</span>
          <br />
          <span className="font-medium">{totalRows}</span> registros
        </div>

    </div>
  );
};