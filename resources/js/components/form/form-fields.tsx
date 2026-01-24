import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Combobox } from "@/components/ui/combobox"
import SmartDateTimePicker from "@/components/ui/datetimepicker"
import { FieldFile } from "@/components/form/field-file"
import { Textarea } from "@/components/ui/textarea"
export const FormField = ({
  id,
  label,
  type = "text",
  value,
  disabled,
  placeholder,
  options = [],
  loading,
  open,
  setOpen,
  onChange,
  onSelect,
  setData,
  view,
  hidden,
}) => {
  const baseProps = { id, value, disabled, placeholder }
  return (
    <div className={`group relative w-full overflow-visible ${hidden ? "hidden" : ""}`}>
      {!hidden && (
        <Label
          htmlFor={id}
          className="bg-background absolute -top-2 left-2 px-1 text-sm z-10"
        >
          {label}
        </Label>
      )}
      {type === "combobox" && (
        <Combobox {...{ ...baseProps, options, loading, open, setOpen, onSelect }} />
      )}
      {["date", "time", "datetime"].includes(type) && (
        <SmartDateTimePicker {...{ type, value, onChange, disabled }} />
      )}
      {type === "file" && (
        <FieldFile {...{ id, value, setData, disabled, view }} />
      )}
      {type === "textarea" && (
        <Textarea {...{ ...baseProps, onChange }} />
      )}
      {!["combobox", "date", "time", "datetime", "file", "textarea"].includes(type) && (
        <Input {...{ ...baseProps, type, onChange }} />
      )}
    </div>
  )
}