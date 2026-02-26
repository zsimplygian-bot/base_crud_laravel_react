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
  icon?: LucideIcon
  icons?: LucideIcon[]
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
  confirmation?: {
    title: string
    description?: string
  }
  size?: "xs" // solo xs por ahora
  buttonColor?: "green" | "red" | "blue" | "gray"
}
export const SmartButton = forwardRef<HTMLButtonElement, Props>(function SmartButton(
  {
    to,
    type = "button",
    icon,
    icons = [],
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
    size,
    buttonColor,
  },
  ref
) {
  const [loading, setLoading] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const executeAction = async () => {
    if (!onClick) return
    const r = onClick()
    if (r instanceof Promise) {
      setLoading(true)
      try { await r } finally { setLoading(false) }
    }
  }

  const handleClick = async (e: React.MouseEvent) => {
    if (!to && type !== "submit") e.preventDefault()
    if (disabled || loading) return
    if (confirmation) {
      setConfirmOpen(true)
      return
    }
    await executeAction()
  }

  const finalIcons = icon ? [icon, ...icons] : icons
  const hasText = !!(label || children || loadingLabel)
  const isIconOnlySingle = !hasText && finalIcons.length === 1
  const IconsEl = finalIcons.length > 0 && (
    <span className="flex items-center gap-1">
      {finalIcons.map((Icon, i) => (
        <Icon key={i} style={{ width: iconSize, height: iconSize }} />
      ))}
    </span>
  )
  const content = loading ? (
    <>
      <Loader2 style={{ width: iconSize, height: iconSize }} className="animate-spin" />
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
  const buttonNode = (
    <span className="inline-flex">
      <Button
        { ...{
          ref,
          type,
          variant,
          asChild: !!to,
          disabled: disabled || loading,
          onClick: handleClick,
          style,
          className: cn(
            isIconOnlySingle ? "w-9 px-0" : "px-2",
            "rounded-full flex items-center gap-2",
            size === "xs" && "h-7 w-7 p-0",
            buttonColor && variant === "default" && colorClasses[buttonColor],
            className
          ),
        } }
      >
        {to ? <Link href={to}>{content}</Link> : content}
      </Button>

      {confirmation && (
        <SmartModal
          { ...{
            open: confirmOpen,
            onOpenChange: setConfirmOpen,
            title: confirmation.title,
            description: confirmation.description,
            confirmation: true,
            onConfirm: async () => {
              setConfirmOpen(false)
              await executeAction()
            },
          } }
        />
      )}
    </span>
  )

  if (!tooltip) return buttonNode

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {buttonNode}
      </TooltipTrigger>
      <TooltipContent side="top">
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  )
})