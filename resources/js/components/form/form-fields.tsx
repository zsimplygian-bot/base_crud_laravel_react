import { FieldWrapper } from "./field-wrapper";
import { FieldInput } from "./field-input";
import { FieldTextarea } from "./field-textarea";
import { FieldButton } from "./field-button";
import { FieldFile } from "./field-file";
import { FieldDate } from "./field-datepicker";
import { FieldTime } from "./field-timepicker";
import { FieldCombobox } from "./field-combobox";
import InputError from "@/components/input-error";
import { useFormCalculate } from "@/hooks/form/use-form-calculate";
import { useMemo } from "react";
const COMPONENT_BY_TYPE = {
  button: FieldButton,
  textarea: FieldTextarea,
  select: FieldCombobox,
  date: FieldDate,
  time: FieldTime,
  file: FieldFile,
};
export const FormFieldsRenderer = ({
  formFields,
  data,
  setData,
  errors,
  readonly,
  isMobile,
  view,
}) => {
  if (!formFields) return null;
  const setDataCalc = useFormCalculate(setData, data);
  // Preprocesar campos una sola vez
  const fields = useMemo(() => {
    return Object.entries(formFields).map(([key, raw]) => ({
      key,
      field: raw.form ?? raw,
    }));
  }, [formFields]);
  const getWidth = (f) =>
    isMobile ? "100%" : f.width ? `${f.width * 120}px` : "200px";
  return (
    <>
      {fields.map(({ key, field }) => {
        if (field.hidden) return null;
        const id = `field-${key}`;
        const Component = COMPONENT_BY_TYPE[field.type] ?? FieldInput;
        const value =
          data[key] ??
          field.value ??
          field.default ??
          "";
        return (
          <div
            key={key}
            className="flex flex-col space-y-1.5"
            style={{ width: getWidth(field) }}
          >
            <FieldWrapper
              label={field.label}
              required={field.required}
              htmlFor={id}
            >
              <Component
                id={id}
                value={value}
                disabled={readonly || field.disabled || field.readonly}
                setData={setDataCalc}
                field={{ ...field, key }}
                view={view}
                placeholder={field.placeholder}
                rows={field.rows}
                type={field.type}
                maxlength={field.maxlength}
              />
            </FieldWrapper>
            <InputError message={errors[key]} />
          </div>
        );
      })}
    </>
  );
};