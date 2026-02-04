// components/file-preview-dialog.tsx
import { Dialog, DialogContent } from "@/components/ui/dialog"

export const FilePreviewDialog = ({ open, onOpenChange, file }: any) => {
  if (!file) return null

  const isDataUrl = typeof file === "string" && file.startsWith("data:")
  const url = isDataUrl
    ? file
    : file.startsWith("http")
      ? file
      : `/storage/${file}`

  const isImage =
    isDataUrl || /\.(jpg|jpeg|png|webp|gif)$/i.test(file)

  const documentUrl = !isImage ? `${url}#zoom=90` : url

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          w-fit h-fit
          px-0 py-10
          max-w-[95vw] max-h-[95vh]
          overflow-hidden
        "
      >
        {isImage ? (
          <img
            src={url}
            alt="Preview archivo"
            className="max-w-[95vw] max-h-[75vh] object-contain"
          />
        ) : (
          <iframe
            src={documentUrl}
            className="w-[80vw] h-[70vh]"
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
