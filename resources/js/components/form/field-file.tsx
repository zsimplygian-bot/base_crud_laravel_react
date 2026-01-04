import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

export const FieldFile = ({ id, value, setData, disabled, view }: any) => {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const fieldName = id.replace("field-", "");
    if (fieldName.toLowerCase().includes("archivo") && typeof value === "string" && value) {
      const url = value.startsWith("http")
        ? value
        : `${window.location.origin}/images/${view}/${value}`;
      setPreview(url);
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
    <div className="flex flex-col gap-3">
      <Input type="file" id={id} onChange={handleChange} disabled={disabled} accept="image/*" />
      {preview && (
        <img src={preview} alt="Preview" className="h-32 w-32 object-cover rounded-md border" />
      )}
    </div>
  );
};
