import { forwardRef, memo } from "react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link } from "@inertiajs/react"
import type { LucideIcon } from "lucide-react"

type BaseItem = {
  label?: string
  icon?: LucideIcon
  color?: string
  disabled?: boolean
  action?: () => void
  to?: string
  external?: boolean
}

export type SDItem =
  | { separator: true }
  | (BaseItem & { type?: "item"; custom?: React.ReactNode })
  | (BaseItem & { type: "checkbox"; checked: boolean; onChange: (v: boolean) => void })

interface Props {
  triggerIcon?: LucideIcon
  triggerLabel?: React.ReactNode
  triggerButtonClassName?: string
  triggerVariant?: string
  triggerBadge?: string | number
  triggerBadgeClassName?: string
  iconSize?: number | string
  triggerSize?: "sm" | "md" | "lg"
  label?: string
  labelExtra?: React.ReactNode
  items: SDItem[]
  align?: "start" | "center" | "end"
  closeOnSelect?: boolean
  itemsMaxHeight?: number | string
}

const sizeMap = {
  sm: "h-7 min-w-7 text-xs",
  md: "h-9 min-w-9 text-sm",
  lg: "h-11 min-w-11 text-base",
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
      iconSize = 20,
      triggerSize,
      label,
      labelExtra,
      items,
      align = "end",
      closeOnSelect = true,
      itemsMaxHeight,
    },
    ref
  ) {
    const prevent = (e: Event) => !closeOnSelect && e.preventDefault()
    const showBadge = triggerBadge !== undefined && triggerBadge !== null && triggerBadge !== 0
    const isIconOnly = !triggerLabel

    const renderIcon = (Icon?: LucideIcon, className?: string) =>
      Icon && <Icon style={{ width: iconSize, height: iconSize }} className={className} />

    const wrapLink = (it: BaseItem, content: React.ReactNode) => {
      if (!it.to) return content
      if (it.external) return <a href={it.to} target="_blank" rel="noreferrer">{content}</a>
      return <Link href={it.to}>{content}</Link>
    }

    const renderItem = (it: SDItem, i: number) => {
      if ("separator" in it) return <DropdownMenuSeparator key={i} />

      if (it.type === "checkbox") {
        return (
          <DropdownMenuCheckboxItem
            key={i}
            {...{
              checked: it.checked,
              disabled: it.disabled,
              onCheckedChange: it.onChange,
              onSelect: prevent,
            }}
          >
            {renderIcon(it.icon, "mr-2 opacity-80")}
            {it.label}
          </DropdownMenuCheckboxItem>
        )
      }

      const content = it.custom ?? (
        <>
          {renderIcon(it.icon, "opacity-80")}
          <span className={it.color}>{it.label}</span>
        </>
      )

      return (
        <DropdownMenuItem
          key={i}
          {...{
            asChild: !!it.to || !!it.custom,
            disabled: it.disabled,
            onClick: it.action,
            onSelect: prevent,
            className: "flex items-center gap-2",
          }}
        >
          {wrapLink(it, content)}
        </DropdownMenuItem>
      )
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            {...{
              ref,
              variant: triggerVariant,
              className: cn(
                "rounded-full relative flex items-center gap-2",
                isIconOnly ? "w-9 px-0" : "px-3",
                triggerSize && sizeMap[triggerSize],
                triggerButtonClassName
              ),
            }}
          >
            {renderIcon(Icon)}
            {triggerLabel}
            {showBadge && (
              <Badge
                {...{
                  className: cn(
                    "absolute -top-1 -right-1 h-4 px-1 text-[10px] leading-none pt-[3px] rounded-full",
                    triggerBadgeClassName
                  ),
                }}
              >
                {triggerBadge}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent {...{ align }}>
          {(label || labelExtra) && (
            <>
              <DropdownMenuLabel className="flex items-center justify-between gap-2">
                {label}
                {labelExtra && <div onClick={e => e.stopPropagation()}>{labelExtra}</div>}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
            </>
          )}

          <div
            {...{
              className: itemsMaxHeight ? "overflow-y-auto" : undefined,
              style: { maxHeight: itemsMaxHeight },
            }}
          >
            {items.map(renderItem)}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  })
)

SmartDropdown.displayName = "SmartDropdown"