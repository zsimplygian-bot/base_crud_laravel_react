import React from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface SheetLayoutProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentAction: string;
  title?: string;
  description?: string;
  borderColor?: string;
  children: React.ReactNode;
}

export const SheetLayout: React.FC<SheetLayoutProps> = ({
  isOpen,
  onOpenChange,
  currentAction,
  title,
  description,
  borderColor = "border-muted",
  children,
}) => {
  if (currentAction === "create") {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className={`w-full ${borderColor}`}>
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className={`w-full ${borderColor}`}>
        <SheetHeader>
          {title && <SheetTitle>{title}</SheetTitle>}
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
};
