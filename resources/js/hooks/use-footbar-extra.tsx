import { FormFieldsRenderer } from "@/components/form-fields";
import { useEffect, useState } from "react";
interface ToolbarExtrasProps {
  isMobile?: boolean;
  acumulado?: Record<string, number>;
  footerFields?: Record<
    string,
    {
      required?: boolean;
      type?: string;
      form?: {
        label?: string;
        type?: string;
        width?: number;
        hidden?: boolean;
      };
    }
  >;
}
export const ToolbarExtras = ({
  acumulado,
  footerFields,
  isMobile = false,
}: ToolbarExtrasProps) => {
  const [setDummyState] = useState({});

  const formData: Record<string, string> = {};
  if (footerFields && acumulado) {
    for (const field in footerFields) {
      const val = acumulado[field];
      formData[field] = typeof val === "number" ? `S/. ${val.toFixed(2)}` : "";
    }
  }
  if (!footerFields || !acumulado) return null;
  return (
    <div className="w-full">
      <div
        className={`flex gap-4 items-end ${
          isMobile ? "flex-col" : "flex-row flex-nowrap overflow-x-auto"
        }`}
        style={{ minWidth: isMobile ? "100%" : undefined }}
      >
        <FormFieldsRenderer
          formFields={footerFields}
          data={formData}
          setData={(field, value) =>
            setDummyState((prev) => ({ ...prev, [field]: value }))
          }
          errors={{}}
          readonly={true}
          configReadonly={true}
          hiddenFields={[]}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
};