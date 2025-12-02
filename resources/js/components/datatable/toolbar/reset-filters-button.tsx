import { Button } from "@/components/ui/button";
import { RotateCcwIcon } from "lucide-react";
import { useResetFilters } from "@/hooks/datatable/toolbar/use-reset-filters";
export function ResetFiltersButton(props) {
  const { canReset, reset } = useResetFilters(props);
  return (
    <Button
      variant="outline"
      onClick={reset}
      className="w-9 px-0 rounded-full"
      disabled={!canReset}
    >
      <RotateCcwIcon className="w-4 h-4 opacity-80"/>
    </Button>
  );
}