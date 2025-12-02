import { useMemo } from "react";
import { format } from "date-fns";

export function useDateRangeFilter(dateRange?: { from?: Date; to?: Date }) {
  const formatted = useMemo(() => {
    if (!dateRange?.from) return ""; // <- sin texto

    const fmt = (d: Date) => format(d, "dd/MM/yy");

    if (dateRange.to) return `${fmt(dateRange.from)} - ${fmt(dateRange.to)}`;

    return fmt(dateRange.from);
  }, [dateRange]);

  return { formatted };
}
