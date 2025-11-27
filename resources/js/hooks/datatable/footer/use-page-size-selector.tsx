// hooks/datatable/footer/use-page-size.ts
import type { DItem } from "@/components/dropdown-menu-base";
export function usePageSizeSelector(
  pageSize: number,
  setPageSize: (v: number) => void,
  setPageIndex: (v: number) => void
) {
  const SIZES = [10, 20, 50, 100, 250, 500];
  const items: DItem[] = SIZES.map((n) => ({
    label: String(n),
    type: "item",
    action: () => {
      setPageSize(n);
      setPageIndex(0);
    },
  }));
  return { items };
}