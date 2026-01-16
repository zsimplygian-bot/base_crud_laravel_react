import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";
import DatePicker from "@/components/ui/datepicker";
import { TimePicker } from "@/components/ui/timepicker";
import { FieldFile } from "@/components/form/field-file";

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
}) => {
  const baseProps = { id, value, disabled, placeholder };

  return (
    <div className="group relative w-full overflow-visible">
      <Label htmlFor={id} className="bg-background absolute -top-2 left-2 px-1 text-sm z-10">
        {label}
      </Label>

      {type === "combobox" && (
        <Combobox {...{ ...baseProps, options, loading, open, setOpen, onSelect }} />
      )}

      {type === "date" && <DatePicker {...{ ...baseProps, onChange }} />}

      {type === "time" && <TimePicker {...{ ...baseProps, onChange }} />}

      {type === "file" && (
        <FieldFile {...{ id, value, setData, disabled, view }} />
      )}

      {!["combobox", "date", "time", "file"].includes(type) && (
        <Input {...{ ...baseProps, type, onChange }} />
      )}
    </div>
  );
};
