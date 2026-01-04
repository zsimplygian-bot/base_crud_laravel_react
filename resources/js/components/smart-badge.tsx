// components/smart-badge.tsx
import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
type SmartBadgeProps = {
  color?: "green" | "yellow" | "gray" | "red" | string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
};
const COLOR_CLASSES: Record<string, string> = {
  green: "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100",
  yellow: "bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100",
  gray: "bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100",
  red: "bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100",
};
// components/smart-badge.tsx
export const SmartBadge: React.FC<SmartBadgeProps & { style?: React.CSSProperties }> = React.memo(
  ({ color = "gray", icon: Icon, children, className = "", style }) => {
    const clsColor = COLOR_CLASSES[color] ?? "";
    return (
      <Badge className={cn("flex items-center gap-1", clsColor, className)} style={style}>
        {Icon && <Icon />}
        {children}
      </Badge>
    );
  }
);

SmartBadge.displayName = "SmartBadge";