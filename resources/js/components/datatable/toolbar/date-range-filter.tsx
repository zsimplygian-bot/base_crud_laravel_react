import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { es } from "date-fns/locale";
import { useDateRangeFilter } from "@/hooks/datatable/toolbar/use-daterange-filter";
interface DateRangeFilterProps {
  dateRange?: { from?: Date; to?: Date };
  setDateRange: (v?: { from?: Date; to?: Date }) => void;
  onApply?: () => void;
}
export function DateRangeFilter({ dateRange, setDateRange, onApply }: DateRangeFilterProps) {
  const { formatted } = useDateRangeFilter(dateRange);
  return (
    <Popover>
      <PopoverTrigger asChild>
  <Button
    variant="outline"
    className={`
      rounded-full
      ${formatted ? "" : "w-9 px-0"}
    `}
  >
    <CalendarIcon className="w-4 h-4 mx-auto" />
    {formatted && <span>{formatted}</span>}
  </Button>
</PopoverTrigger>

      <PopoverContent className="p-0 w-auto">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={(r) => {
              setDateRange(r);
              onApply?.();
            }}
            locale={es}
          />
      </PopoverContent>
    </Popover>
  );
}