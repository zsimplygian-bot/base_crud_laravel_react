// components/photo-preview.tsx
import { useState } from "react"
import { SmartButton } from "@/components/smart-button"
import { SmartModal } from "@/components/smart-modal"

type Props = {
  filePath: string
  alt?: string
  size?: number
  fileName?: string
  uploadedAt?: string | Date
}

export const PhotoPreview = ({ filePath, alt = "Imagen", size = 48, fileName, uploadedAt }: Props) => {
  const [open, setOpen] = useState(false)
  const preview = filePath.replace(/image_(\d+)\.jpg$/, "image-prev_$1.jpg")
  const full = filePath

  return (
    <>
      <SmartButton
        {...{ onClick: () => setOpen(true), className: "p-0 rounded-md relative", variant: "ghost", style: { width: size, height: size } }}
      >
        {preview && (
          <img
            {...{ src: `/storage/${preview}`, alt, className: "absolute top-0 left-0 w-full h-full object-cover rounded-md border", loading: "lazy" }}
          />
        )}
      </SmartButton>

      <SmartModal {...{ open, onOpenChange: setOpen, title: "Imagen" }}>
        <div {...{ className: "flex flex-col items-center gap-2" }}>
          <img {...{ src: `/storage/${full}`, alt, className: "max-h-[80dvh] max-w-full object-contain rounded-md", loading: "lazy" }} />
          {(fileName || uploadedAt) && (
            <div {...{ className: "text-center text-sm text-gray-500" }}>
              {fileName && <div {...{ className: "font-medium" }}>{fileName}</div>}
              {uploadedAt && <div>{typeof uploadedAt === "string" ? uploadedAt : new Date(uploadedAt).toLocaleString()}</div>}
            </div>
          )}
        </div>
      </SmartModal>
    </>
  )
}