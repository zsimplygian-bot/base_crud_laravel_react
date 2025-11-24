import { Input } from "@/components/ui/input";

export const FieldInput = ({
  id,
  type,
  value,
  disabled,
  placeholder,
  maxlength,
  setData,
}: any) => (
  <Input
    id={id}
    type={type || "text"}
    value={value ?? ""}
    onChange={(e) => setData(id.replace("field-", ""), e.target.value)}
    disabled={disabled}
    maxLength={maxlength}
    placeholder={placeholder || " "}
    className="w-full"
  />
);
