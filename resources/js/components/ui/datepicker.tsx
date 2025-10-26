'use client'

import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"

interface DatePickerProps {
  id?: string
  value?: string
  onChange?: (date: string) => void
  placeholder?: string
  disabled?: boolean
}

export const DatePicker: React.FC<DatePickerProps> = ({
  id,
  value,
  onChange,
  placeholder = "--/--/----",
  disabled = false,
}) => {
  const [open, setOpen] = useState(false)
  const selectedDate = value ? new Date(value + "T00:00:00") : undefined

  const handleSelect = (date: Date | undefined) => {
    if (!date) return
    onChange?.(format(date, "yyyy-MM-dd"))
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full">
          <Input
            id={id}
            readOnly
            disabled={disabled}
            placeholder={placeholder}
            value={selectedDate ? format(selectedDate, "yyyy/dd/MM") : ""}
            className="cursor-pointer pr-9 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <CalendarIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  )
}
