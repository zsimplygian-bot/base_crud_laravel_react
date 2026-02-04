// components/smart-modal.tsx
import { ReactNode } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet"

interface SmartModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: ReactNode
  description?: string
  type?: "dialog" | "sheet"
  side?: "right" | "left" | "top" | "bottom"
  size?: string
}

export const SmartModal = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  type = "dialog",
  side = "right",
  size,
}: SmartModalProps) =>
  type === "sheet" ? (
    <Sheet {...{ open, onOpenChange }}>
      <SheetContent
        {...{
          side,
          className: `${size || ""} h-dvh max-h-dvh flex flex-col overflow-hidden`,
        }}
      >
        <SheetHeader className="shrink-0">
          <SheetTitle>{title.toUpperCase()}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 -mt-6">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  ) : (
    <Dialog {...{ open, onOpenChange }}>
      <DialogContent
        {...{
          className: `
            ${size || ""}
            max-h-[90dvh]
            flex flex-col
            overflow-hidden
          `,
        }}
      >
        <DialogHeader className="shrink-0">
          <DialogTitle>{title.toUpperCase()}</DialogTitle>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>

        <div className="overflow-y-auto">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
