import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Combobox } from "@/components/ui/combobox"
import SmartDateTimePicker from "@/components/ui/datetimepicker"
import { FieldFile } from "@/components/form/field-file"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

export const FormField = ({
  id,
  label,
  type = "text",
  value,
  disabled,
  placeholder,
  open,
  setOpen,
  onChange,
  onSelect,
  setData,
  view,
  hidden,
  required = true, // Por defecto requerido
}: any) => {
  const base = { id, disabled, placeholder, required }
  const isCheckbox = type === "checkbox"

  return (
    <div className={`${hidden ? "hidden" : ""} relative`}>
      {!hidden && label && !isCheckbox && (
        <Label
          htmlFor={id}
          className="absolute -top-3 left-2 px-1 bg-background text-sm z-10"
        >
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </Label>
      )}

      {type === "combobox" && (
        <Combobox
          {...{
            ...base,
            value,
            onSelect,
            ...(open !== undefined && setOpen ? { open, setOpen } : {}),
          }}
        />
      )}

      {["date", "time", "datetime"].includes(type) && (
        <SmartDateTimePicker
          {...{ type, value, onChange, disabled, required }}
        />
      )}

      {type === "file" && (
        <FieldFile {...{ id, value, setData, disabled, view }} />
      )}

      {type === "textarea" && (
        <Textarea {...{ ...base, value, onChange }} />
      )}

      {isCheckbox && (
        <div className="flex items-center gap-2 pt-0">
          <Checkbox
            {...{
              checked: Boolean(value),
              disabled,
              onCheckedChange: v => onChange(Boolean(v)),
            }}
          />
          <Label htmlFor={id}>
            {label}
            {required && <span className="ml-0.5 text-red-500">*</span>}
          </Label>
        </div>
      )}

      {!["combobox", "date", "time", "datetime", "file", "textarea", "checkbox"].includes(type) && (
        <Input {...{ ...base, type, value, onChange }} />
      )}
    </div>
  )
}