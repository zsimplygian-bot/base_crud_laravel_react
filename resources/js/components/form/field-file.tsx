import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { SmartButton } from "@/components/smart-button"
import { FilePreviewDialog } from "@/components/file-preview-dialog"
import { Image as ImageIcon, FileText } from "lucide-react"

export const FieldFile = ({ id, value, setData, disabled }: any) => {
  const [preview, setPreview] = useState<string | null>(null)
  const [isImage, setIsImage] = useState(false)
  const [openPreview, setOpenPreview] = useState(false)
  const [previewFile, setPreviewFile] = useState<string | null>(null)

  useEffect(() => {
    if (typeof value === "string" && value) {
      const url = value.startsWith("http") ? value : `/storage/${value}`
      setPreview(url)
      setPreviewFile(value)
      setIsImage(/\.(jpg|jpeg|png|webp|gif)$/i.test(value))
    } else {
      setPreview(null)
      setPreviewFile(null)
      setIsImage(false)
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setData(id.replace("field-", ""), file)

    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result as string)
        setPreviewFile(reader.result as string)
        setIsImage(true)
      }
      reader.readAsDataURL(file)
    } else {
      setPreview(file.name)
      setPreviewFile(file.name)
      setIsImage(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <Input
        type="file"
        id={id}
        onChange={handleChange}
        disabled={disabled}
        accept="image/*,application/pdf"
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
            tooltip={isImage ? "Ver imagen" : "Ver documento"}
            variant="ghost"
            onClick={() => setOpenPreview(true)}
          />
        </div>
      )}

      <FilePreviewDialog
        open={openPreview}
        onOpenChange={setOpenPreview}
        file={previewFile}
      />
    </div>
  )
}
