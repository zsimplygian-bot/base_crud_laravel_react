// components/file-preview-dialog.tsx
import { Dialog, DialogContent } from "@/components/ui/dialog"

export const FilePreviewDialog = ({ open, onOpenChange, file }: any) => {
  if (!file) return null

  const isString = typeof file === "string" // Evita repetir typeof
  const url = isString && file.startsWith("http") ? file : isString && file.startsWith("data:") ? file : `/storage/${file}`
  const isImage = isString && (file.startsWith("data:") || /\.(jpg|jpeg|png|webp|gif)$/i.test(file))
  const isPdf = isString && /\.pdf$/i.test(file) // Detecta PDF

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="">
        {isImage ? (
          <img src={url} className="w-full h-full object-contain" />
        ) : isPdf ? (
          <a href={url} target="_blank" rel="noopener noreferrer" className="underline">
            Abrir PDF
          </a>
        ) : (
          <iframe src={url} className="w-full h-full" />
        )}
      </DialogContent>
    </Dialog>
  )
}
