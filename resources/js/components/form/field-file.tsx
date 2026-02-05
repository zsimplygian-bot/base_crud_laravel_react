import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { SmartButton } from "@/components/smart-button";
import { FilePreviewDialog } from "@/components/file-preview-dialog";
import { Image as ImageIcon, FileText, Trash } from "lucide-react";

export const FieldFile = ({ id, value, setData, disabled }: any) => {
  const field = id.replace("field-", "");
  const inputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [isImage, setIsImage] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [removed, setRemoved] = useState(false);

  // Cargar archivo existente solo si no fue eliminado
  useEffect(() => {
    if (!value || removed) {
      setPreview(null);
      setIsImage(false);
      return;
    }

    let url: string;
    if (typeof value === "string") {
      url = value.startsWith("http") ? value : `/storage/${value}`;
      setIsImage(/\.(jpg|jpeg|png|webp|gif)$/i.test(value));
      setPreview(url);
    } else if (value instanceof File) {
      // Nuevo archivo seleccionado
      setIsImage(value.type.startsWith("image/"));
      if (value.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result as string);
        reader.readAsDataURL(value);
      } else {
        setPreview(value.name); // mostrar nombre para PDFs
      }
    }
  }, [value, removed]);

  // Subir archivo nuevo
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setRemoved(false);
    setData(field, file);
    setData(`${field}_remove`, false);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
      setIsImage(true);
    } else {
      setPreview(file.name); // nombre para PDF
      setIsImage(false);
    }
  };

  // Borrar archivo
  const handleClear = () => {
    setRemoved(true);
    setData(field, null);
    setData(`${field}_remove`, true);
    setPreview(null);
    setIsImage(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-3">
      <Input
        ref={inputRef}
        type="file"
        id={id}
        disabled={disabled}
        accept="image/*,application/pdf"
        onChange={handleChange}
      />

      {preview && (
        <div className="flex items-center gap-2">
          {isImage && (
            <img
              src={preview}
              alt="Preview"
              className="h-20 w-20 object-cover rounded-md border"
            />
          )}

          <SmartButton
            icon={isImage ? ImageIcon : FileText}
            variant="ghost"
            tooltip={isImage ? "Ver imagen" : "Ver documento"}
            onClick={() => {
              if (!isImage) {
                // Para PDF, abrir en nueva pestaña si preview es nombre
                const url = typeof value === "string" ? `/storage/${value}` : preview;
                window.open(url, "_blank");
              } else {
                setOpenPreview(true);
              }
            }}
          />

          {!disabled && (
            <SmartButton
              icon={Trash}
              variant="ghost"
              tooltip="Eliminar archivo"
              onClick={handleClear}
            />
          )}
        </div>
      )}

      {isImage && (
        <FilePreviewDialog
          open={openPreview}
          onOpenChange={setOpenPreview}
          file={preview ?? ""}
        />
      )}
    </div>
  );
};
