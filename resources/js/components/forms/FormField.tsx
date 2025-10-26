import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { Link } from "@inertiajs/react";

type FieldProps = {
  fieldKey: string;
  field: any;
  value: any;
  error?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  width?: number;
  options?: any[];
  onChange: (name: string, value: any) => void;
  ApiButton?: React.FC<{ fieldKey: string }>;
  shouldRenderCreateButton?: (key: string) => boolean;
  getCreateLink?: (key: string) => string;
};

export default function FormField({
  fieldKey,
  field,
  value,
  onChange,
  error,
  disabled,
  required,
  options = [],
  ApiButton,
  shouldRenderCreateButton,
  getCreateLink,
}: FieldProps) {
  const { label, type, rows = 3, placeholder } = field;
  const className = "w-full";

  const renderField = () => {
    switch (type) {
      case "textarea":
        return (
          <Textarea
            id={fieldKey}
            value={value}
            onChange={(e) => onChange(fieldKey, e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            className={className}
          />
        );

      case "select":
        return (
          <div className="flex items-center gap-1">
            <Select
              name={fieldKey}
              value={value?.toString()}
              onValueChange={(v) => onChange(fieldKey, v)}
              disabled={disabled}
            >
              <SelectTrigger id={fieldKey} className={className}>
                <SelectValue placeholder="Seleccione..." />
              </SelectTrigger>
              <SelectContent>
                {options.length > 0 ? (
                  options.map((opt: any) => (
                    <SelectItem key={opt.id} value={opt.id.toString()}>
                      {opt.label}
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    No hay opciones
                  </div>
                )}
              </SelectContent>
            </Select>
            {shouldRenderCreateButton?.(fieldKey) && (
              <Link
                href={getCreateLink?.(fieldKey) ?? "#"}
                className="p-1 rounded bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Plus size={16} />
              </Link>
            )}
            {ApiButton && <ApiButton fieldKey={fieldKey} />}
          </div>
        );

      case "date":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Input
                id={fieldKey}
                type="text"
                readOnly
                disabled={disabled}
                value={
                  value ? format(new Date(value + "T00:00:00"), "dd/MM/yyyy") : ""
                }
                className={`${className} cursor-pointer`}
              />
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={value ? new Date(value + "T00:00:00") : undefined}
                onSelect={(date) => onChange(fieldKey, date ? format(date, "yyyy-MM-dd") : "")}
              />
            </PopoverContent>
          </Popover>
        );

      case "textarea":
        return (
          <Textarea
            id={fieldKey}
            value={value}
            onChange={(e) => onChange(fieldKey, e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            className={className}
          />
        );

      default:
        return (
          <Input
            id={fieldKey}
            type={type || "text"}
            value={value}
            onChange={(e) => onChange(fieldKey, e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={className}
          />
        );
    }
  };

  return (
    <div className="flex flex-col space-y-1.5">
      {label && (
        <label htmlFor={fieldKey} className="text-sm font-medium flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {renderField()}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
