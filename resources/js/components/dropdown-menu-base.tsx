import { useState } from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuItem, DropdownMenuCheckboxItem, } from "@/components/ui/dropdown-menu";
import { Link } from "@inertiajs/react";
export type DItem =
  | { separator: true }
  | {
      label?: string;
      icon?: React.ElementType;
      color?: string;
      href?: string;           // Link interno
      external?: boolean;      // <a> externa
      action?: () => void;     // función
      custom?: React.ReactNode; // Render completo custom
      type?: "item" | "checkbox";
      checked?: boolean;
      onChange?: (v: boolean) => void;
      disabled?: boolean;
    };

export default function DropdownMenuBase({
  trigger,
  label,
  items,
  closeOnSelect = true,
  align = "end",
  itemHover = true,          // ← NUEVA PROP
}: {
  trigger: React.ReactNode;
  label?: string;
  items: DItem[];
  closeOnSelect?: boolean;
  align?: "start" | "center" | "end";
  itemHover?: boolean;        // ← NUEVA PROP
}) {
  const [open, setOpen] = useState(false);

  const handleSelect = (fn?: () => void) => {
    fn?.();
    if (closeOnSelect) setOpen(false);
  };

  // Clases para hover opcional
  const hoverClass = itemHover ? "hover:bg-accent cursor-pointer" : "cursor-default";

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>

      <DropdownMenuContent align={align}>
        {label && (
          <>
            <DropdownMenuLabel>{label}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}

        {items.map((it, i) =>
          "separator" in it && it.separator ? (
            <DropdownMenuSeparator key={i} />
          ) : it.type === "checkbox" ? (
            <DropdownMenuCheckboxItem
              key={i}
              checked={!!it.checked}
              disabled={it.disabled}
              className={hoverClass}
              onCheckedChange={(v) => {
                it.onChange?.(v);
                if (!closeOnSelect) return;
                setOpen(false);
              }}
              onSelect={(e) => !closeOnSelect && e.preventDefault()}
            >
              {it.icon && <it.icon className="w-4 h-4 opacity-80 mr-2" />}
              {it.label}
            </DropdownMenuCheckboxItem>
          ) : it.custom ? (
            <DropdownMenuItem
              asChild
              key={i}
              onClick={() => handleSelect(it.action)}
              className={hoverClass}
            >
              {it.custom}
            </DropdownMenuItem>
          ) : it.href ? (
            <DropdownMenuItem
              asChild
              key={i}
              onClick={() => handleSelect(it.action)}
              className={hoverClass}
            >
              {it.external ? (
                <a
                  href={it.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 w-full ${it.color ?? ""}`}
                >
                  {it.icon && <it.icon className="w-4 h-4 opacity-80" />}
                  {it.label}
                </a>
              ) : (
                <Link
                  href={it.href}
                  className={`flex items-center gap-2 w-full ${it.color ?? ""}`}
                >
                  {it.icon && <it.icon className="w-4 h-4 opacity-80" />}
                  {it.label}
                </Link>
              )}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              key={i}
              disabled={it.disabled}
              onClick={() => handleSelect(it.action)}
              className={`flex items-center gap-2 w-full ${hoverClass}`}
            >
              {it.icon && <it.icon className="w-4 h-4 opacity-80" />}
              <span className={it.color ?? ""}>{it.label}</span>
            </DropdownMenuItem>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
