// hooks/datatable/footer/use-pagination-buttons.ts
import { ChevronsLeftIcon, ChevronLeftIcon, ChevronRightIcon, ChevronsRightIcon, } from "lucide-react";
export function usePaginationButtons(
  totalRows: number,
  pageIndex: number,
  setPageIndex: (v: number) => void,
  pageSize: number
) {
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  return {
    totalPages,
    nav: [
      {
        icon: <ChevronsLeftIcon className="w-4 h-4" />,
        disabled: pageIndex === 0,
        fn: () => setPageIndex(0),
      },
      {
        icon: <ChevronLeftIcon className="w-4 h-4" />,
        disabled: pageIndex === 0,
        fn: () => setPageIndex((p) => Math.max(0, p - 1)),
      },
      {
        icon: <ChevronRightIcon className="w-4 h-4" />,
        disabled: pageIndex >= totalPages - 1,
        fn: () => setPageIndex((p) => Math.min(totalPages - 1, p + 1)),
      },
      {
        icon: <ChevronsRightIcon className="w-4 h-4" />,
        disabled: pageIndex >= totalPages - 1,
        fn: () => setPageIndex(totalPages - 1),
      },
    ],
  };
}