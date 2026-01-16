// SmartModal.tsx
import { ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
interface SmartModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  description?: string;
  type?: "dialog" | "sheet";
  side?: "right" | "left" | "top" | "bottom";
  size?: string;
}
export const SmartModal = ({ open, onOpenChange, title, description, children, type = "dialog", side = "right", size }: SmartModalProps) =>
  type === "sheet" ? (
    <Sheet {...{ open, onOpenChange }}>
      <SheetContent {...{ side, className: size || "" }}>
        <SheetHeader>
          <SheetTitle>{title.toUpperCase()}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        <div className="p-4 -mt-6">{children}</div>
      </SheetContent>
    </Sheet>
  ) : (
    <Dialog {...{ open, onOpenChange }}>
      <DialogContent {...{ className: size || "" }}>
        <DialogHeader>
          <DialogTitle>{title.toUpperCase()}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );