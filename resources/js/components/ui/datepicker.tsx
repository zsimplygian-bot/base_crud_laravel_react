// components/ui/datepicker.tsx
import { useState, useCallback } from "react";
import { CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, parse } from "date-fns";
import { es } from "date-fns/locale";
interface DatePickerProps {
  id?: string;
  value?: string; // formato: "2025-04-15"
  onChange?: (date: string) => void;
  placeholder?: string;
  disabled?: boolean;
}
export const DatePicker: React.FC<DatePickerProps> = ({
  id,
  value = "",
  onChange,
  placeholder = "----/--/--",
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  // Convertir string → Date (solo si es válido)
  const selectedDate = value
    ? parse(value, "yyyy-MM-dd", new Date())
    : undefined;
  const isValidDate = selectedDate && !isNaN(selectedDate.getTime());
  const displayValue = isValidDate
    ? format(selectedDate, "yyyy/MM/dd")
    : "";
  const handleSelect = useCallback(
    (date: Date | undefined) => {
      if (!date) {
        onChange?.("");
      } else {
        onChange?.(format(date, "yyyy-MM-dd"));
      }
      setOpen(false);
    },
    [onChange]
  );
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full">
          <Input
            id={id}
            readOnly
            disabled={disabled}
            placeholder={placeholder}
            value={displayValue}
            className="cursor-pointer pr-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <CalendarIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 z-50" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          disabled={disabled}
          locale={es}
        />
      </PopoverContent>
    </Popover>
  );
};
export default DatePicker;