import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { es } from "date-fns/locale"
import { format } from "date-fns"
interface DateRange {
  from?: Date
  to?: Date
}
interface DateRangeFilterProps {
  dateRange?: DateRange
  setDateRange: (v?: DateRange) => void
  onApply?: () => void
  iconSize?: number // Tamaño del icono, default 20
}
export function DateRangeFilter({
  dateRange,
  setDateRange,
  onApply,
  iconSize = 20,
}: DateRangeFilterProps) {
  const formatted = (() => {
    if (!dateRange?.from) return ""
    const fmt = (d: Date) => format(d, "dd/MM/yy")
    return dateRange.to && dateRange.from !== dateRange.to
      ? `${fmt(dateRange.from)} - ${fmt(dateRange.to)}`
      : fmt(dateRange.from)
  })()
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className={`rounded-full ${formatted ? "" : "w-9 px-0"}`}>
          <CalendarIcon style={{ width: iconSize, height: iconSize }} />
          {formatted && <span>{formatted}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-auto">
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={r => {
            setDateRange(r)
            onApply?.()
          }}
          locale={es}
        />
      </PopoverContent>
    </Popover>
  )
}