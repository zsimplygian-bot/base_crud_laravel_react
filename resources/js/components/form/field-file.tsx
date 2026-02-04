import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

export const FieldFile = ({ id, value, setData, disabled }: any) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isImage, setIsImage] = useState(false);

  useEffect(() => {
    if (typeof value === "string" && value) {
      const url = value.startsWith("http")
        ? value
        : `/storage/${value}`; // Ruta pública Laravel
      setPreview(url);
      setIsImage(/\.(jpg|jpeg|png|webp|gif)$/i.test(value));
    } else {
      setPreview(null);
      setIsImage(false);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setData(id.replace("field-", ""), file); // Enviar File al backend

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
        setIsImage(true);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(file.name); // Documento sin preview visual
      setIsImage(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <Input
        type="file"
        id={id}
        onChange={handleChange}
        disabled={disabled}
        accept="image/*,application/pdf"
      />

      {preview && isImage && (
        <img
          src={preview}
          alt="Preview"
          className="h-32 w-32 object-cover rounded-md border"
        />
      )}

      {preview && !isImage && (
        <a
          href={typeof preview === "string" && preview.startsWith("/") ? preview : undefined}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 underline"
        >
          Ver documento
        </a>
      )}
    </div>
  );
};
