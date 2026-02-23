// components/smart-modal.tsx
import { ReactNode } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, } from "./ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, } from "./ui/sheet"
interface SmartModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: ReactNode
  description?: string
  icon?: React.ComponentType<any>
  type?: "dialog" | "sheet"
  side?: "right" | "left" | "top" | "bottom"
  size?: string
  iconSize?: number
}
export const SmartModal = ({
  open,
  onOpenChange,
  title,
  description,
  icon: Icon,
  iconSize = 20,
  children,
  type = "dialog",
  side = "right",
  size,
}: SmartModalProps) =>
  type === "sheet" ? (
    <Sheet {...{ open, onOpenChange }}>
      <SheetContent {...{ side, className: `w-full sm:max-w-md md:max-w-lg lg:max-w-xl
            ${size || ""} h-dvh max-h-dvh flex flex-col overflow-hidden`}} >
        <SheetHeader className="shrink-0">
          <div className="flex items-center gap-2">
            <SheetTitle>{title.toUpperCase()}</SheetTitle>
            {Icon && <Icon style={{ width: iconSize, height: iconSize }} />}
          </div>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-4 -mt-6">{children}</div>
      </SheetContent>
    </Sheet>
  ) : (
    <Dialog {...{ open, onOpenChange }}>
      <DialogContent {...{ className: `${size || ""} max-h-[90dvh] flex flex-col overflow-hidden` }} >
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>{title.toUpperCase()}</DialogTitle>
            {Icon && <Icon style={{ width: iconSize, height: iconSize }} />}
          </div>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  )