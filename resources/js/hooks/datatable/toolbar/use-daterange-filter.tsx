import { useMemo } from "react";
import { format } from "date-fns";
export function useDateRangeFilter(dateRange?: { from?: Date; to?: Date }) {
  const formatted = useMemo(() => {
    if (!dateRange?.from) return "Fecha";
    if (dateRange.to) {
      return `${format(dateRange.from, "LLL dd, yyyy")} - ${format(
        dateRange.to,
        "LLL dd, yyyy"
      )}`;
    }
    return format(dateRange.from, "LLL dd, yyyy");
  }, [dateRange]);
  return { formatted };
}