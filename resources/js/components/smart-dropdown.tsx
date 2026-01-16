// components/smart-dropdown.tsx
import { forwardRef, memo } from "react"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuItem,
  DropdownMenuCheckboxItem, DropdownMenuLabel, } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link } from "@inertiajs/react"
import type { LucideIcon } from "lucide-react"
type Base = {
  label?: string
  icon?: LucideIcon
  color?: string
  disabled?: boolean
  action?: () => void
  to?: string // Permite navegación
  external?: boolean // Link externo
}
export type SDItem =
  | { separator: true }
  | (Base & { type?: "item"; custom?: React.ReactNode })
  | (Base & { type: "checkbox"; checked: boolean; onChange: (v: boolean) => void })
interface Props {
  triggerIcon?: LucideIcon
  triggerLabel?: string | React.ReactNode
  triggerButtonClassName?: string
  triggerVariant?: "outline" | "ghost" | "default" | string
  triggerBadge?: string | number
  triggerBadgeClassName?: string
  label?: string
  labelExtra?: React.ReactNode
  items: SDItem[]
  align?: "start" | "center" | "end"
  closeOnSelect?: boolean
}
export const SmartDropdown = memo(
  forwardRef<HTMLButtonElement, Props>(function SmartDropdown(
    {
      triggerIcon: Icon,
      triggerLabel,
      triggerButtonClassName,
      triggerVariant = "default",
      triggerBadge,
      triggerBadgeClassName,
      label,
      labelExtra,
      items,
      align = "end",
      closeOnSelect = true,
    },
    ref
  ) {
    const showLabel = !!(triggerLabel && String(triggerLabel).trim())
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            ref={ref}
            {...{
              variant: triggerVariant,
              className: cn(
                showLabel ? "px-3" : "w-9 px-0",
                "rounded-full relative flex items-center gap-2",
                triggerButtonClassName
              ),
            }}
          >
            {Icon && <Icon className="size-4" />}
            {showLabel && <span>{triggerLabel}</span>}
            {triggerBadge && (
              <Badge
                className={cn(
                  "absolute -top-1 -right-1 text-[10px] h-4 px-1 rounded-full",
                  triggerBadgeClassName
                )}
              >
                {triggerBadge}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={align}>
          {(label || labelExtra) && (
            <>
              <DropdownMenuLabel className="flex items-center justify-between gap-2">
                {label && <span>{label}</span>}
                {labelExtra && (
                  <div onClick={e => e.stopPropagation()}>
                    {labelExtra}
                  </div>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
            </>
          )}
          {items.map((it, i) => {
            if ("separator" in it) return <DropdownMenuSeparator key={i} />
            const ItemIcon = it.icon
            if (it.type === "checkbox") {
              return (
                <DropdownMenuCheckboxItem
                  key={i}
                  {...{
                    checked: it.checked,
                    disabled: it.disabled,
                    onCheckedChange: it.onChange,
                    onSelect: e => !closeOnSelect && e.preventDefault(),
                  }}
                >
                  {ItemIcon && <ItemIcon className="size-4 mr-2 opacity-80" />}
                  {it.label}
                </DropdownMenuCheckboxItem>
              )
            }
            if (it.custom) {
              return (
                <DropdownMenuItem
                  key={i}
                  {...{
                    asChild: true,
                    onSelect: e => !closeOnSelect && e.preventDefault(),
                  }}
                >
                  {it.custom}
                </DropdownMenuItem>
              )
            }
            const content = (
              <>
                {ItemIcon && <ItemIcon className="size-4 opacity-80" />}
                <span className={it.color}>{it.label}</span>
              </>
            )
            if (it.to) {
              return (
                <DropdownMenuItem
                  key={i}
                  {...{
                    asChild: true,
                    disabled: it.disabled,
                    onSelect: e => !closeOnSelect && e.preventDefault(),
                    className: "flex items-center gap-2",
                  }}
                >
                  {it.external ? (
                    <a href={it.to} target="_blank" rel="noreferrer">
                      {content}
                    </a>
                  ) : (
                    <Link href={it.to}>{content}</Link>
                  )}
                </DropdownMenuItem>
              )
            }
            return (
              <DropdownMenuItem
                key={i}
                {...{
                  disabled: it.disabled,
                  onClick: it.action,
                  onSelect: e => !closeOnSelect && e.preventDefault(),
                  className: "flex items-center gap-2",
                }}
              >
                {content}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  })
)
SmartDropdown.displayName = "SmartDropdown"