import { useMemo, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import InputError from "@/components/input-error";
import { Link } from "@inertiajs/react";
import { Combobox } from "@/components/ui/combobox";
import { DatePicker } from "@/components/ui/datepicker";
import { TimePicker } from "@/components/ui/timepicker";

type Props = {
  formFields: Record<string, any>;
  data: Record<string, any>;
  setData: (field: string, value: any) => void;
  errors: Record<string, string>;
  readonly: boolean;
  configReadonly: boolean;
  hiddenFields: string[];
  isMobile: boolean;
  inputRefs: React.MutableRefObject<Record<string, HTMLInputElement | null>>;
  view?: string; // ← Subcarpeta opcional
};

// ---------- Wrapper ----------
const FieldWrapper = ({ label, required, htmlFor, children }: any) =>
  label ? (
    <div className="group relative w-full">
      <Label
        htmlFor={htmlFor}
        className="bg-background text-foreground absolute top-0 left-2 -translate-y-1/2 px-1 text-xs z-10 flex items-center gap-1"
      >
        {label}
        {required && <span className="text-destructive text-xs">*</span>}
      </Label>
      {children}
    </div>
  ) : (
    <>{children}</>
  );

// ---------- Inputs ----------
const FieldInput = ({ id, type, value, disabled, setData, inputRefs, placeholder, maxlength, readonly }: any) => (
  <Input
    id={id}
    type={type || "text"}
    value={value || ""}
    onChange={(e) => setData(id.replace("field-", ""), e.target.value)}
    readOnly={readonly}
    disabled={disabled}
    maxLength={maxlength}
    placeholder={placeholder || " "}
    className="w-full"
    ref={(el) => {
      if (inputRefs?.current) inputRefs.current[id.replace("field-", "")] = el;
    }}
  />
);

const FieldTextarea = ({ id, value, disabled, setData, placeholder, rows = 3 }: any) => (
  <Textarea
    id={id}
    value={value || ""}
    onChange={(e) => setData(id.replace("field-", ""), e.target.value)}
    rows={rows}
    disabled={disabled}
    placeholder={placeholder || " "}
    className="w-full"
  />
);

const FieldButton = ({ field }: any) => (
  <Link
    href={field.url || "#"}
    className={`inline-block px-4 py-2 rounded text-white text-center ${
      field.color === "blue" ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-600 hover:bg-gray-700"
    }`}
    target="_blank"
    rel="noopener noreferrer"
  >
    {field.label}
  </Link>
);

const FieldCombobox = ({ value, field, disabled, setData }: any) => {
  const options = useMemo(
    () =>
      Array.isArray(field.options?.data)
        ? field.options.data
        : Array.isArray(field.options)
        ? field.options
        : [],
    [field.options]
  );

  const createUrl = useMemo(() => {
    if (!field.key) return "#";
    const key = field.key.replace(/^id_/, "");
    return `/${key}/form/create`;
  }, [field.key]);

  return (
    <Combobox
      value={value?.toString() || ""}
      fieldKey={field.key}
      options={options}
      disabled={disabled}
      placeholder={field.placeholder}
      onChange={(val) => setData(field.key, val)}
      createUrl={createUrl}
    />
  );
};

// ---------- File ----------
const FieldFile = ({ id, value, setData, disabled, view }: any) => {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const fieldName = id.replace("field-", "");

    if (fieldName.toLowerCase().includes("imagen") && typeof value === "string") {
      const imageUrl = value.startsWith("http")
        ? value
        : view
        ? `${window.location.origin}/images/${view}/${value}`
        : `${window.location.origin}/images/${value}`;
      setPreview(imageUrl);
    }
  }, [value, id, view]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setData(id.replace("field-", ""), file);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-2">
      <Input type="file" id={id} onChange={handleChange} disabled={disabled} accept="image/*" />
      {preview && value && (
  <img
    src={preview}
    alt="Vista previa"
    className="h-24 w-24 object-cover rounded-md border border-gray-400"
  />
)}

    </div>
  );
};

// ---------- Render Principal ----------
export const FormFieldsRenderer: React.FC<Props> = ({
  formFields,
  data,
  setData,
  errors,
  readonly,
  configReadonly,
  hiddenFields,
  isMobile,
  inputRefs,
  view,
}) => {
  if (!formFields || typeof formFields !== "object") return null;

  return (
    <>
      {Object.entries(formFields).map(([key, rawField]) => {
        const field = rawField.form ?? rawField;
        if (field.hidden || hiddenFields.includes(key)) return null;

        const id = `field-${key}`;
        const disabled = field.disabled || field.readonly || readonly || configReadonly;
        const value = data[key] ?? field.value ?? field.default ?? "";
        const width =
          isMobile ? "100%" : typeof field.width === "number" ? `${field.width * 120}px` : "200px";

        const fieldProps = { id, value, disabled, setData, field: { ...field, key } };

        const renderField = () => {
          switch (field.type) {
            case "button":
              return <FieldButton field={field} />;
            case "textarea":
              return <FieldTextarea {...fieldProps} placeholder={field.placeholder} rows={field.rows} />;
            case "select":
              return <FieldCombobox {...fieldProps} />;
            case "date":
              return <DatePicker {...fieldProps} onChange={(v: string) => setData(key, v)} />;
            case "time":
              return <TimePicker {...fieldProps} onChange={(v: string) => setData(key, v)} />;
            case "file":
              return <FieldFile {...fieldProps} view={view} />;
            default:
              return (
                <FieldInput
                  {...fieldProps}
                  type={field.type}
                  placeholder={field.placeholder}
                  maxlength={field.maxlength}
                  readonly={field.readonly}
                  inputRefs={inputRefs}
                />
              );
          }
        };

        return (
          <div key={key} className="flex flex-col space-y-1.5" style={{ width }}>
            <FieldWrapper label={field.label} required={field.required} htmlFor={id}>
              {renderField()}
            </FieldWrapper>
            <InputError message={errors[key]} />
          </div>
        );
      })}
    </>
  );
};

export default FormFieldsRenderer;
