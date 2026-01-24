import DatePicker from "@/components/ui/datepicker"
import { TimePicker } from "@/components/ui/timepicker"
export default function SmartDateTimePicker({
  type = "date", // date | time | datetime
  value,
  onChange,
  disabled,
}) {
  const date = value ? String(value).split(" ")[0] : ""
  const time = value ? String(value).split(" ")[1]?.slice(0, 5) : ""
  const emit = (d, t) => {
    if (type === "date") return onChange(d)
    if (type === "time") return onChange(t)
    onChange(`${d} ${t}:00`)
  }
  const onDateChange = v => {
    const d = v?.target ? v.target.value : v
    if (!d) return
    emit(d, time || "00:00")
  }
  const onTimeChange = v => {
    const t = v?.target ? v.target.value : v
    if (!t) return
    emit(date || new Date().toISOString().split("T")[0], t)
  }
  return (
    <div className={type === "datetime" ? "flex gap-2" : ""}>
      {(type === "date" || type === "datetime") && (
        <DatePicker value={date} onChange={onDateChange} disabled={disabled} />
      )}
      {(type === "time" || type === "datetime") && (
        <TimePicker value={time} onChange={onTimeChange} disabled={disabled} />
      )}
    </div>
  )
}