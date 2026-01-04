export function usePaginationButtons(
  totalRows: number,
  pageIndex: number,
  setPageIndex: (page: number) => void,
  pageSize: number
) {
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const lastPage = totalPages - 1;
  const safeSetPage = (page: number) => {
    if (page < 0 || page > lastPage) return;
    setPageIndex(page);
  };
  const buttons = [
    {
      type: "first",
      disabled: pageIndex === 0,
      goToPage: () => safeSetPage(0),
    },
    {
      type: "previous",
      disabled: pageIndex === 0,
      goToPage: () => safeSetPage(pageIndex - 1),
    },
    {
      type: "next",
      disabled: pageIndex >= lastPage,
      goToPage: () => safeSetPage(pageIndex + 1),
    },
    {
      type: "last",
      disabled: pageIndex >= lastPage,
      goToPage: () => safeSetPage(lastPage),
    },
  ];
  return { totalPages, buttons };
}