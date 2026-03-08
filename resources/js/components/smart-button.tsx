import { forwardRef, useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { Link } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Loader2 } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { SmartModal } from "@/components/smart-modal"

type Size = "xs" | "sm" | "md" | "lg"

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
  size?: Size
  buttonColor?: "green" | "red" | "blue" | "gray"
}

const sizeMap: Record<Size, string> = { xs: "6", sm: "8", md: "9", lg: "12" }

const colorClasses: Record<string, string> = {
  green: "bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700",
  red: "bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700",
  blue: "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700",
  gray: "bg-gray-800 text-white hover:bg-gray-900 dark:bg-gray-900 dark:hover:bg-gray-950",
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

  const iconsArray = useMemo(
  () =>
    (Array.isArray(icons) ? icons : icons ? [icons] : []).filter(Boolean), // Elimina undefined/null
  [icons]
)
  const hasText = !!(label || children || loadingLabel)
  const isIconOnly = !hasText && iconsArray.length === 1
  const unit = sizeMap[size]

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
    if (confirmation) return setConfirmOpen(true)
    await executeAction()
  }

  const IconsEl = iconsArray.length > 0 && (
    <span className="flex items-center gap-1">
      {iconsArray.map((Icon, i) => (
        <Icon key={i} style={{ width: iconSize, height: iconSize }} />
      ))}
    </span>
  )

  const Content = loading ? (
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
            "rounded-full flex items-center justify-center",
            isIconOnly ? `h-${unit} w-${unit} px-0` : `h-${unit} px-2`,
            buttonColor && variant === "default" && colorClasses[buttonColor],
            className
          ),
        }}
      >
        {to ? <Link {...{ href: to }}>{Content}</Link> : Content}
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