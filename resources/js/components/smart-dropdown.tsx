// components/smart-dropdown.tsx
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { Badge } from "@/components/ui/badge";
import type { LucideIcon } from "lucide-react";

type Base = {
  label?: string;
  icon?: LucideIcon;
  color?: string;
  disabled?: boolean;
  action?: () => void;
};

export type SDItem =
  | { separator: true }
  | (Base & {
      type?: "item";
      href?: string;
      external?: boolean;
      custom?: React.ReactNode;
    })
  | (Base & {
      type: "checkbox";
      checked: boolean;
      onChange: (v: boolean) => void;
    });

interface Props {
  triggerIcon?: LucideIcon;
  triggerLabel?: string | React.ReactNode;
  triggerButtonClassName?: string;
  triggerVariant?: "outline" | "ghost" | "default" | string;
  triggerBadge?: string | number;
  triggerBadgeClassName?: string;   // prop declared
  label?: string;
  items: SDItem[];
  align?: "start" | "center" | "end";
  closeOnSelect?: boolean;
}

export const SmartDropdown = forwardRef<HTMLButtonElement, Props>(
  (
    {
      triggerIcon: Icon,
      triggerLabel,
      triggerButtonClassName,
      triggerVariant = "outline",
      triggerBadge,
      triggerBadgeClassName, // ← ensure it's destructured here
      label,
      items,
      align = "end",
      closeOnSelect = true,
    },
    ref
  ) => {
    const showLabel = !!(triggerLabel && String(triggerLabel).trim());
    const trigger = (
      <Button
        ref={ref}
        variant={triggerVariant}
        className={cn(
          showLabel ? "px-3" : "w-9 px-0",
          "rounded-full relative",
          triggerButtonClassName
        )}
      >
        {Icon && <Icon className="size-4" />}
        {showLabel && <span>{triggerLabel}</span>}

        {triggerBadge && (
          <Badge
            variant=""
            className={cn(
              `
              absolute -top-1 -right-1
              text-[10px] leading-none h-4 px-1
              flex items-center justify-center
              rounded-full
              `,
              triggerBadgeClassName // ← now used safely
            )}
          >
            {triggerBadge}
          </Badge>
        )}
      </Button>
    );

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
        <DropdownMenuContent align={align}>
          {label && (
            <>
              <DropdownMenuLabel>{label}</DropdownMenuLabel>
              <DropdownMenuSeparator />
            </>
          )}
          {items.map((it, i) => {
            if ("separator" in it) {
              return <DropdownMenuSeparator key={i} />;
            }
            const ItemIcon = it.icon;
            if (it.type === "checkbox") {
              return (
                <DropdownMenuCheckboxItem
                  key={i}
                  checked={it.checked}
                  disabled={it.disabled}
                  className="cursor-pointer hover:bg-accent"
                  onCheckedChange={it.onChange}
                  onSelect={(e: any) => {
                    if (!closeOnSelect) e.preventDefault?.();
                  }}
                >
                  {ItemIcon && <ItemIcon className="size-4 opacity-80 mr-2" />}
                  {it.label}
                </DropdownMenuCheckboxItem>
              );
            }
            if (it.custom) {
              return (
                <DropdownMenuItem
                  key={i}
                  asChild
                  className="cursor-pointer hover:bg-accent"
                  onSelect={(e: any) => {
                    if (!closeOnSelect) e.preventDefault?.();
                  }}
                  onClick={() => it.action?.()}
                >
                  {it.custom}
                </DropdownMenuItem>
              );
            }
            if (it.href) {
              const content = (
                <div className={cn("flex items-center gap-2 w-full", it.color)}>
                  {ItemIcon && <ItemIcon className="size-4 opacity-80" />}
                  {it.label}
                </div>
              );
              return (
                <DropdownMenuItem
                  key={i}
                  asChild
                  className="cursor-pointer hover:bg-accent"
                  onSelect={(e: any) => {
                    if (!closeOnSelect) e.preventDefault?.();
                  }}
                >
                  {it.external ? (
                    <a
                      href={it.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => it.action?.()}
                    >
                      {content}
                    </a>
                  ) : (
                    <Link href={it.href} onClick={() => it.action?.()}>
                      {content}
                    </Link>
                  )}
                </DropdownMenuItem>
              );
            }
            return (
              <DropdownMenuItem
                key={i}
                disabled={it.disabled}
                className="cursor-pointer hover:bg-accent flex items-center gap-2"
                onSelect={(e: any) => {
                  if (!closeOnSelect) e.preventDefault?.();
                }}
                onClick={() => it.action?.()}
              >
                {ItemIcon && <ItemIcon className="size-4 opacity-80" />}
                <span className={it.color}>{it.label}</span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);
SmartDropdown.displayName = "SmartDropdown";
