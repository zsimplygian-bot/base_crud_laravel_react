import { DatePicker } from "@/components/ui/datepicker";

export const FieldDate = ({ id, value, setData, disabled }: any) => (
  <DatePicker id={id} value={value} disabled={disabled} onChange={(v) => setData(id.replace("field-", ""), v)} />
);
