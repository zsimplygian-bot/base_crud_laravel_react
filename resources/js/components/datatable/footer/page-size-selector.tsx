// components/datatable/footer/page-size-selector.tsx
import { memo, useMemo } from "react";
import { SmartDropdown } from "@/components/smart-dropdown";
interface Props {
  pageSize: number;
  setPageSize: (size: number) => void;
  setPageIndex: (page: number) => void;
}
export const PageSizeSelector = memo(function PageSizeSelector({
  pageSize,
  setPageSize,
  setPageIndex
}: Props) {
  const items = useMemo(() => {
    const SIZES = [10, 20, 50, 100, 250, 500];
    return SIZES.map((n) => ({
      label: String(n),
      action: () => {
        setPageSize(n);
        setPageIndex(0);
      }
    }));
  }, [setPageSize, setPageIndex]);
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm opacity-70">Filas:</span>
      <SmartDropdown
        items={items}
        triggerLabel={String(pageSize)}
      />
    </div>
  );
});