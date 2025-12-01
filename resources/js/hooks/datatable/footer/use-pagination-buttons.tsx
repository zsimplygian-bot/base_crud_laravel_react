// hooks/datatable/footer/use-pagination-buttons.ts
export type PaginationButton = {
  type: "first" | "previous" | "next" | "last"
  disabled: boolean
  goToPage: () => void
}
export function usePaginationButtons(
  totalRows: number,
  pageIndex: number,
  setPageIndex: (page: number) => void,
  pageSize: number
) {
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize))
  const buttons: PaginationButton[] = [
    {
      type: "first",
      disabled: pageIndex === 0,
      goToPage: () => setPageIndex(0),
    },
    {
      type: "previous",
      disabled: pageIndex === 0,
      goToPage: () => setPageIndex(p => Math.max(0, p - 1)),
    },
    {
      type: "next",
      disabled: pageIndex >= totalPages - 1,
      goToPage: () => setPageIndex(p => Math.min(totalPages - 1, p + 1)),
    },
    {
      type: "last",
      disabled: pageIndex >= totalPages - 1,
      goToPage: () => setPageIndex(totalPages - 1),
    },
  ]
  return { totalPages, buttons }
}