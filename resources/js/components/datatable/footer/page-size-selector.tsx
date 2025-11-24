// components/datatable/footer/page-size-selector.tsx
import { Button } from "@/components/ui/button";
import DropdownMenuBase from "@/components/dropdown-menu";
import { usePageSizeSelector } from "@/hooks/datatable/footer/use-page-size-selector";
export const PageSizeSelector = ({
  pageSize,
  setPageSize,
  setPageIndex,
}: {
  pageSize: number;
  setPageSize: (v: number) => void;
  setPageIndex: (v: number) => void;
}) => {
  const { items } = usePageSizeSelector(pageSize, setPageSize, setPageIndex);
  return (
    <div className="flex items-center gap-2">
      <span>Filas:</span>
      <DropdownMenuBase
        trigger={
          <Button variant="outline" size="sm">
            {pageSize}
          </Button>
        }
        items={items}
        align="start"
      />
    </div>
  );
};