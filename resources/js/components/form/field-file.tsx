import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { SmartButton } from "@/components/smart-button"
import { Trash, FileText } from "lucide-react"
import { PhotoPreview } from "@/components/photo-preview"
export const FieldFile = ({ id, value, setData, disabled }: any) => {
  const field = id.replace("field-", "")
  const inputRef = useRef<HTMLInputElement>(null)
  const [isImage, setIsImage] = useState(false)
  const [removed, setRemoved] = useState(false)
  const [filePath, setFilePath] = useState<string | null>(null) // ruta para PhotoPreview o nombre PDF
  // ⚡ Cargar archivo existente solo si no fue eliminado
  useEffect(() => {
    if (!value || removed) {
      setFilePath(null)
      setIsImage(false)
      return
    }
    if (typeof value === "string") {
      setIsImage(/\.(jpg|jpeg|png|webp|gif)$/i.test(value))
      setFilePath(value)
    } else if (value instanceof File) {
      setIsImage(value.type.startsWith("image/"))
      if (!value.type.startsWith("image/")) {
        setFilePath(value.name) // PDF
      } else {
        // Para imágenes locales nuevas, usar DataURL
        const reader = new FileReader()
        reader.onload = () => setFilePath(reader.result as string)
        reader.readAsDataURL(value)
      }
    }
  }, [value, removed])
  // Subir archivo nuevo
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setRemoved(false)
    setData(field, file)
    setData(`${field}_remove`, false)
    setIsImage(file.type.startsWith("image/"))
    if (!file.type.startsWith("image/")) {
      setFilePath(file.name)
    } else {
      const reader = new FileReader()
      reader.onload = () => setFilePath(reader.result as string)
      reader.readAsDataURL(file)
    }
  }
  // Borrar archivo
  const handleClear = () => {
    setRemoved(true)
    setData(field, null)
    setData(`${field}_remove`, true)
    setFilePath(null)
    setIsImage(false)
    if (inputRef.current) inputRef.current.value = ""
  }
  return (
    <div {...{ className: "flex flex-col gap-3" }}>
      <Input {...{ ref: inputRef, type: "file", id, disabled, accept: "image/*,application/pdf", onChange: handleChange, }} />
      {filePath && (
        <div {...{ className: "flex items-center gap-2" }}>
          {isImage ? (
            <PhotoPreview {...{ filePath, alt: "Preview", size: 50 }} />
          ) : (
            <SmartButton {...{ icon: FileText, variant: "ghost", tooltip: "Ver documento",
                onClick: () => {
                  const url = typeof value === "string" ? `/storage/${value}` : filePath
                  window.open(url, "_blank")
                },
              }}
            />
          )}
          {!disabled && (
            <SmartButton {...{ icon: Trash, variant: "ghost", tooltip: "Eliminar archivo", onClick: handleClear, }} />
          )}
        </div>
      )}
    </div>
  )
}