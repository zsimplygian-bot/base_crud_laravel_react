import { useMemo } from "react";
import { ChevronsLeftIcon, ChevronLeftIcon, ChevronRightIcon, ChevronsRightIcon } from "lucide-react";
import type { DItem } from "@/components/dropdown-menu";
// Lógica de paginación y navegación
const navIcons = [
  <ChevronsLeftIcon />,
  <ChevronLeftIcon />,
  <ChevronRightIcon />,
  <ChevronsRightIcon />
];
export interface NavItem {
  fn: () => void;
  disable: boolean;
  icon: JSX.Element;
}
export const usePagination = (
  totalRows: number,
  pageIndex: number,
  setPageIndex: (index: number) => void,
  pageSize: number,
  setPageSize: (size: number) => void
) => {
  // Cálculo de total de páginas
  const totalPages = useMemo(() => Math.max(1, Math.ceil(totalRows / pageSize)), [totalRows, pageSize]);
  // Botones de navegación (primera, anterior, siguiente, última)
  const nav: NavItem[] = useMemo(() => [
    { fn: () => setPageIndex(0), disable: pageIndex === 0, icon: navIcons[0] },
    { fn: () => setPageIndex(p => Math.max(p - 1, 0)), disable: pageIndex === 0, icon: navIcons[1] },
    { fn: () => setPageIndex(p => Math.min(p + 1, totalPages - 1)), disable: pageIndex >= totalPages - 1, icon: navIcons[2] },
    { fn: () => setPageIndex(totalPages - 1), disable: pageIndex >= totalPages - 1, icon: navIcons[3] },
  ], [pageIndex, totalPages, setPageIndex]);
  // Opciones de filas por página
  const pageSizes = [10, 25, 50, 100, 250, 1000];
  const pageSizeItems: DItem[] = useMemo(() =>
    pageSizes.map(s => ({
      label: String(s),
      action: () => { setPageSize(s); setPageIndex(0); },
      type: "item" as const
    })),
    [setPageSize, setPageIndex]
  );
  return { totalPages, nav, pageSizeItems };
};