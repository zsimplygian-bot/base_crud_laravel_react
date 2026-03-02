import { forwardRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Link } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Loader2 } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { SmartModal } from "@/components/smart-modal"

type Props = {
  to?: string
  type?: "button" | "submit" | "reset"
  icons?: LucideIcon | LucideIcon[]      
  iconPosition?: "left" | "right"
  iconSize?: number | string
  label?: React.ReactNode
  loadingLabel?: React.ReactNode
  tooltip?: string
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive"
  disabled?: boolean
  onClick?: (e?: React.MouseEvent) => void | Promise<void>
  confirmation?: { title: string; description?: string }
  size?: "xs" | "sm" | "md" | "lg" 
  buttonColor?: "green" | "red" | "blue" | "gray"
}

export const SmartButton = forwardRef<HTMLButtonElement, Props>(function SmartButton(props, ref) {
  const {
    to,
    type = "button",
    icons,
    iconPosition = "left",
    iconSize = 20,
    label,
    loadingLabel,
    tooltip,
    children,
    className,
    style,
    onClick,
    variant = "default",
    disabled = false,
    confirmation,
    size = "md",
    buttonColor
  } = props

  const [loading, setLoading] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const iconsArray = Array.isArray(icons) ? icons : icons ? [icons] : []

  const executeAction = async () => {
    if (!onClick) return
    const result = onClick()
    if (result instanceof Promise) {
      setLoading(true)
      try { await result } finally { setLoading(false) }
    }
  }

  const handleClick = async (e: React.MouseEvent) => {
    if (!to && type !== "submit") e.preventDefault()
    if (disabled || loading) return
    if (confirmation) { setConfirmOpen(true); return }
    await executeAction()
  }

  const hasText = !!(label || children || loadingLabel)
  const isIconOnly = !hasText && iconsArray.length === 1

  const IconsEl = iconsArray.filter(Boolean).length > 0 && (
    <span className="flex items-center gap-1">
      {iconsArray.filter(Boolean).map((Icon, i) => (
        <Icon key={i} style={{ width: iconSize, height: iconSize }} />
      ))}
    </span>
  )

  const content = loading ? (
    <>
      <Loader2 className="animate-spin" style={{ width: iconSize, height: iconSize }} />
      {hasText && <span>{loadingLabel ?? label ?? children}</span>}
    </>
  ) : (
    <>
      {iconPosition === "left" && IconsEl}
      {hasText && <span>{label ?? children}</span>}
      {iconPosition === "right" && IconsEl}
    </>
  )

  const colorClasses: Record<string, string> = {
    green: "bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700",
    red: "bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700",
    blue: "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700",
    gray: "bg-gray-800 text-white hover:bg-gray-900 dark:bg-gray-900 dark:hover:bg-gray-950",
  }

  const sizeClasses: Record<string, string> = {
    xs: "h-7 w-7 text-xs px-0",
    sm: "h-8 w-8 text-sm px-2",
    md: "h-10 w-auto text-base px-3",
    lg: "h-12 w-auto text-lg px-4",
  }

  const buttonNode = (
    <span className="inline-flex">
      <Button
        {...{
          ref,
          type,
          variant,
          asChild: !!to,
          disabled: disabled || loading,
          style,
          onClick: handleClick,
          className: cn(
            isIconOnly ? "w-9 px-0" : "px-2",
            "rounded-full flex items-center gap-2",
            sizeClasses[size],
            buttonColor && variant === "default" && colorClasses[buttonColor],
            className
          ),
        }}
      >
        {to ? <Link {...{ href: to }}>{content}</Link> : content}
      </Button>

      {confirmation && (
        <SmartModal
          {...{
            open: confirmOpen,
            onOpenChange: setConfirmOpen,
            title: confirmation.title,
            description: confirmation.description,
            confirmation: true,
            onConfirm: async () => { setConfirmOpen(false); await executeAction() },
          }}
        />
      )}
    </span>
  )

  return tooltip ? (
    <Tooltip>
      <TooltipTrigger asChild>{buttonNode}</TooltipTrigger>
      <TooltipContent side="top"><p>{tooltip}</p></TooltipContent>
    </Tooltip>
  ) : buttonNode
})