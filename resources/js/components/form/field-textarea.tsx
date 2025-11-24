import { Textarea } from "@/components/ui/textarea";

export const FieldTextarea = ({
  id,
  value,
  disabled,
  placeholder,
  rows = 3,
  setData,
}: any) => (
  <Textarea
    id={id}
    value={value ?? ""}
    onChange={(e) => setData(id.replace("field-", ""), e.target.value)}
    rows={rows}
    disabled={disabled}
    placeholder={placeholder || " "}
    className="w-full min-h-24"
  />
);
