// components/form/form-field.tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";
import DatePicker from "@/components/ui/datepicker";
import { TimePicker } from "@/components/ui/timepicker";

export const FormField = ({
  id,
  label,
  type = "text",
  value,
  disabled,
  options = [],
  loading,
  open,
  setOpen,
  onChange,
  onSelect,
}) => {
  return (
    <div className="group relative w-full overflow-visible">
      <Label
        htmlFor={id}
        className="bg-background absolute -top-2 left-2 px-1 text-sm z-10"
      >
        {label}
      </Label>

      {type === "combobox" && (
        <Combobox
          {...{
            id,
            value,
            disabled,
            options,
            loading,
            selectedLabel:
              options.find(o => String(o.id) === String(value))?.label ?? "",
            open,
            setOpen,
            onSelect
          }}
        />
      )}

      {type === "date" && (
        <DatePicker
          {...{
            id,
            value,
            disabled,
            onChange
          }}
        />
      )}

      {type === "time" && (
        <TimePicker
          {...{
            id,
            value,
            disabled,
            onChange
          }}
        />
      )}

      {!["combobox","date","time"].includes(type) && (
        <Input
          {...{
            id,
            type,
            value,
            disabled,
            onChange
          }}
        />
      )}
    </div>
  );
};
