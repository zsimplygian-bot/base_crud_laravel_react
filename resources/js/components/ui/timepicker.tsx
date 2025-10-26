import { ClockIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import React, { useRef } from "react"
interface TimePickerProps {
  id?: string
  value?: string
  onChange?: (time: string) => void
  placeholder?: string
  disabled?: boolean
}
export const TimePicker: React.FC<TimePickerProps> = ({
  id,
  value,
  onChange,
  placeholder = "Seleccionar hora",
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const handleClick = () => {
    if (!disabled) inputRef.current?.showPicker?.()
  }
  return (
    <div
      className="relative w-full cursor-pointer"
      onClick={handleClick}
    >
      <Input
        ref={inputRef}
        id={id}
        type="time"
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="pr-9 focus:border-blue-500 focus:ring-1 focus:ring-blue-500
          [appearance:textfield]
          [&::-webkit-calendar-picker-indicator]:opacity-0
          [&::-webkit-clear-button]:hidden
          [&::-webkit-inner-spin-button]:hidden
          [&::-webkit-time-picker-indicator]:hidden"
      />
      <ClockIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
    </div>
  )
}