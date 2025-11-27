// components/datatable/footer/pagination-buttons.tsx
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { usePaginationButtons } from "@/hooks/datatable/footer/use-pagination-buttons";
export const PaginationButtons = ({
  totalRows,
  pageIndex,
  setPageIndex,
  pageSize,
  onTotalPages,
}) => {
  const { totalPages, nav } = usePaginationButtons(
    totalRows,
    pageIndex,
    setPageIndex,
    pageSize
  );
  // FIX: NO setState during render
  useEffect(() => {
    onTotalPages(totalPages);
  }, [totalPages]);
  return (
    <div className="flex items-center gap-1">
      {nav.map((n, i) => (
        <Button
          key={i}
          variant="outline"
          className="h-8 w-8 p-0 border border-input"
          onClick={n.fn}
          disabled={n.disabled}
        >
          {n.icon}
        </Button>
      ))}
    </div>
  );
};