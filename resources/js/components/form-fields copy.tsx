import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Link } from "@inertiajs/react";
import { Label } from "@/components/ui/label";
import InputError from "@/components/input-error";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { useCreateButtonLink } from "@/hooks/use-create-button-link";
// 👇 importamos el hook del ApiButton
import { useFetchWithButton } from "@/hooks/use-fetch-with-button";
type Props = {
  formFields: any;
  data: any;
  setData: (field: string, value: any) => void;
  errors: any;
  readonly: boolean;
  configReadonly: boolean;
  hiddenFields: string[];
  isMobile: boolean;
  inputRefs: React.MutableRefObject<Record<string, HTMLInputElement | null>>;
  view: string;
  apiConfig?: {
    inputKey: string;
    type: "text" | "file";
    endpoint: string;
    fields: Record<string, string>;
    emptyValue?: any;
  };
};
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
  apiConfig,
}) => {
  if (!formFields || typeof formFields !== "object") return null;
  const { shouldRenderCreateButton, getCreateLink } = useCreateButtonLink();
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});
  const [firstKeyPressed, setFirstKeyPressed] = useState<string | null>(null);
  const searchInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  // 👇 inicializamos el ApiButton desde el hook
  const ApiButton = useFetchWithButton({ data, setData, apiConfig, view });
  const handleValueChange = (fieldKey: string, value: string) => {
    setData(fieldKey, value);
    setSearchTerms((prev) => ({ ...prev, [fieldKey]: "" }));
  };
  const handleOpenChange = (
    open: boolean,
    key: string | null,
    setKey: (key: string | null) => void
  ) => {
    if (!open) setKey(null);
  };
  const clearSearch = () => setSearchTerms({});
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldKey: string,
    value: string
  ) => {
    if (fieldKey === "correo") {
      if (e.key === "@" && value.includes("@")) e.preventDefault();
      if ([" ", "'", "%"].includes(e.key)) e.preventDefault();
    } else if (fieldKey === "direccion") {
      if (["'", "%"].includes(e.key)) e.preventDefault();
    } else if (fieldKey === "ruc") {
      if ([".", "+", "-"].includes(e.key)) e.preventDefault();
    }
  };
  return (
    <>
      {Object.entries(formFields).map(([fieldKey, field]: any) => {
        const f = field.form ?? field;
        if (f.hidden || hiddenFields.includes(fieldKey)) return null;

        const isReadonly = f.readonly || readonly || configReadonly;
        const disabled = f.disabled || isReadonly;
        const value = data[fieldKey] ?? f.value ?? f.default ?? "";
        const width = typeof f.width === "number" ? `${f.width * 120}px` : "200px";
        const style = { width: isMobile ? "100%" : width };
        const searchTerm = searchTerms[fieldKey] || "";
        const inputProps: any = {
          readOnly: isReadonly,
          disabled,
          required: f.required,
          maxLength: f.maxlength,
          pattern: f.pattern,
          ...(f.type === "number" && f.step && { step: f.step }),
          onKeyDown: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            handleKeyDown(e, fieldKey, value),
        };
        const opcionesSelect = Array.isArray(f.options?.data)
          ? f.options.data
          : Array.isArray(f.options)
          ? f.options
          : [];
        if (f.type === "button") {
          return (
            <div key={fieldKey} className="flex flex-col space-y-1.5" style={style}>
              <Label>{f.label}</Label>
              <Link
                href={f.url || "#"}
                className={`inline-block px-4 py-2 rounded text-white text-center ${
                  f.color === "blue"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-600 hover:bg-gray-700"
                }`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {f.label}
              </Link>
            </div>
          );
        }
        return (
          <div key={fieldKey} className="flex flex-col space-y-1.5" style={style}>
            <Label htmlFor={fieldKey}>{f.label}</Label>
            {f.type === "multiselect" ? (
              <div className="flex items-center">
                <MultiSelect
                  options={opcionesSelect}
                  value={value}
                  onChange={(val) => setData(fieldKey, val)}
                  disabled={disabled}
                  className="w-full"
                />
                {ApiButton && <ApiButton fieldKey={fieldKey} />}
              </div>
            ) : f.type === "select" ? (
              <div className="flex items-center">
                <Select
                  name={fieldKey}
                  value={value?.toString()}
                  onValueChange={(v) => handleValueChange(fieldKey, v)}
                  onOpenChange={(open) => {
                    handleOpenChange(open, firstKeyPressed, setFirstKeyPressed);
                    if (!open) clearSearch();
                  }}
                  required={f.required}
                  disabled={disabled}
                >
                  <SelectTrigger
                    id={fieldKey}
                    className="w-full truncate overflow-hidden whitespace-nowrap"
                    onKeyDownCapture={(e) => {
                      if (
                        !searchTerm &&
                        e.key.length === 1 &&
                        !e.ctrlKey &&
                        !e.metaKey &&
                        !e.altKey
                      ) {
                        setFirstKeyPressed(e.key);
                        setTimeout(() => {
                          searchInputRefs.current[fieldKey]?.focus();
                        }, 150);
                      }
                    }}
                  >
                    <SelectValue placeholder="-" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="p-2 flex items-center gap-2">
                      <div className="relative w-full">
                        <input
                          ref={(el) => (searchInputRefs.current[fieldKey] = el)}
                          type="text"
                          className={`w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none ${
                            shouldRenderCreateButton(fieldKey) ? "pr-10" : "pr-6"
                          }`}
                          placeholder="Buscar..."
                          value={searchTerm}
                          onChange={(e) =>
                            setSearchTerms((prev) => ({
                              ...prev,
                              [fieldKey]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => e.stopPropagation()}
                        />
                        {searchTerm && (
                          <button
                            type="button"
                            onClick={clearSearch}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                            tabIndex={-1}
                          >
                            &times;
                          </button>
                        )}
                      </div>
                      {shouldRenderCreateButton(fieldKey) && (
                        <Link
                          href={getCreateLink(fieldKey)}
                          className="flex-shrink-0 p-1 rounded bg-blue-500 hover:bg-blue-600 text-white"
                          title={`Agregar nuevo ${f.label}`}
                        >
                          <Plus size={16} />
                        </Link>
                      )}
                    </div>
                    {Array.isArray(opcionesSelect) && opcionesSelect.length > 0 ? (
                      opcionesSelect
                        .filter((option: any) =>
                          option.label?.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((option: any) => (
                          <SelectItem
                            key={option.id}
                            value={option.id?.toString()}
                            onMouseDown={(e) => e.preventDefault()}
                          >
                            {option.label}
                          </SelectItem>
                        ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        {!f.options?.data?.length
                          ? f.options?.message
                            ? `⚠️ ${f.options.message}`
                            : "No hay opciones disponibles"
                          : null}
                      </div>
                    )}
                  </SelectContent>
                </Select>
                {ApiButton && <ApiButton fieldKey={fieldKey} />}
              </div>
            ) : f.type === "textarea" ? (
              <div className="flex items-center">
                <Textarea
                  id={fieldKey}
                  value={value}
                  onChange={(e) => setData(fieldKey, e.target.value)}
                  disabled={disabled}
                  className="w-full"
                  rows={f.rows || 3}
                  onKeyDown={(e) => handleKeyDown(e, fieldKey, value)}
                />
                {ApiButton && <ApiButton fieldKey={fieldKey} />}
              </div>
            ) : f.type === "date" ? (
              <div className="flex items-center">
                <Popover>
                  <PopoverTrigger asChild>
                    <Input
                      id={fieldKey}
                      type="text"
                      value={value ? format(new Date(value), "dd/MM/yyyy") : ""}
                      readOnly
                      disabled={disabled}
                      className="w-full cursor-pointer"
                    />
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={value ? new Date(value) : undefined}
                      onSelect={(date) => setData(fieldKey, date?.toISOString())}
                      disabled={disabled}
                    />
                  </PopoverContent>
                </Popover>
                {ApiButton && <ApiButton fieldKey={fieldKey} />}
              </div>
            ) : f.type === "image" || f.type === "file" ? (
              <>
                <div className="flex items-center gap-2">
                  <label
                    htmlFor={`file-input-${fieldKey}`}
                    className="inline-block px-3 py-2 bg-gray-200 text-sm rounded cursor-pointer hover:bg-gray-300 text-black"
                  >
                    Seleccionar archivo
                  </label>
                  <input
                    id={`file-input-${fieldKey}`}
                    type="file"
                    accept={f.accept || (f.type === "image" ? "image/*" : undefined)}
                    disabled={disabled}
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setData(fieldKey, file);
                    }}
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      const file = data[fieldKey];
                      if (!file || !(file instanceof File)) {
                        alert("Seleccione un archivo primero");
                        return;
                      }
                      const formData = new FormData();
                      formData.append(fieldKey, file);
                      formData.append("view", view);
                      try {
                        const csrfToken = document
                          .querySelector('meta[name="csrf-token"]')
                          ?.getAttribute("content");
                        const response = await fetch("/ruta-api-upload", {
                          method: "POST",
                          headers: {
                            "X-CSRF-TOKEN": csrfToken || "",
                          },
                          body: formData,
                          credentials: "same-origin",
                        });
                        if (!response.ok) {
                          alert("Error subiendo archivo");
                          return;
                        }
                        const result = await response.json();
                        setData(fieldKey, result.filename);
                      } catch (error) {
                        alert("Error subiendo archivo");
                        console.error(error);
                      }
                    }}
                    disabled={disabled || typeof value === "string"}
                    className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm"
                  >
                    Subir
                  </button>
                  {ApiButton && <ApiButton fieldKey={fieldKey} />}
                </div>
                {value && typeof value === "object" && value.name && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Archivo seleccionado: {value.name}
                  </p>
                )}
                {value && typeof value === "string" && (
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-muted-foreground">Archivo subido: {value}</p>
                    <>
                      <p className="text-sm text-muted-foreground">Vista previa:</p>
                      {console.log("Renderizando preview", value, view)}
                      <img
                        src={`/images/${view}/${value}`}
                        alt={`Vista previa de ${f.label}`}
                        className="max-h-48 rounded border"
                      />
                    </>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center">
                <Input
                  id={fieldKey}
                  type={f.type || "text"}
                  value={value}
                  onChange={(e) => setData(fieldKey, e.target.value)}
                  className="w-full"
                  {...inputProps}
                  ref={(el) => {
                    inputRefs?.current && (inputRefs.current[fieldKey] = el);
                  }}
                />
                {ApiButton && <ApiButton fieldKey={fieldKey} />}
              </div>
            )}
            <InputError message={errors[fieldKey]} />
          </div>
        );
      })}
    </>
  );
};