import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { es } from "date-fns/locale";
import { format } from "date-fns";
interface DateRangeFilterProps {
  dateRange?: { from?: Date; to?: Date };
  setDateRange: (v?: { from?: Date; to?: Date }) => void;
  onApply?: () => void;
}
export function DateRangeFilter({ dateRange, setDateRange, onApply }: DateRangeFilterProps) {
  const formatted = dateRange?.from
    ? dateRange.to
      ? `${format(dateRange.from, "LLL dd, yyyy")} - ${format(dateRange.to, "LLL dd, yyyy")}`
      : format(dateRange.from, "LLL dd, yyyy")
    : "Fecha";
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <CalendarIcon className="w-3 h-3" />
          <span>{formatted}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-0 w-auto">
        <div className="w-[250px]">
            <Calendar
            mode="range"
            selected={dateRange}
            onSelect={(r) => {
                setDateRange(r);
                onApply?.();
            }}
            locale={es}
            />
        </div>
        </PopoverContent>
    </Popover>
  );
}