// components/file-preview-dialog.tsx
import { Dialog, DialogContent } from "@/components/ui/dialog"

export const FilePreviewDialog = ({ open, onOpenChange, file }: any) => {
  if (!file) return null

  const url = typeof file === "string" && file.startsWith("http") ? file : typeof file === "string" && file.startsWith("data:") ? file : `/storage/${file}`
  const isImage = typeof file === "string" && (file.startsWith("data:") || /\.(jpg|jpeg|png|webp|gif)$/i.test(file))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-screen w-[80vh] max-w-none">

        {isImage ? (
          <img src={url} className="w-full h-full object-contain" />
        ) : (
          <iframe src={url} className="w-full h-full" />
        )}
      </DialogContent>
    </Dialog>
  )
}
