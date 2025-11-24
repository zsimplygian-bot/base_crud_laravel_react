import { TimePicker } from "@/components/ui/timepicker";

export const FieldTime = ({ id, value, setData, disabled }: any) => (
  <TimePicker id={id} value={value} disabled={disabled} onChange={(v) => setData(id.replace("field-", ""), v)} />
);
