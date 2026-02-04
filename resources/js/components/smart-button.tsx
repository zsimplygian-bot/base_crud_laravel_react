import { forwardRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Link } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Loader2 } from "lucide-react"
import type { LucideIcon } from "lucide-react"

type Props = {
  to?: string
  type?: "button" | "submit" | "reset"
  icon?: LucideIcon
  iconPosition?: "left" | "right"
  label?: React.ReactNode
  loadingLabel?: React.ReactNode
  tooltip?: string
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive"
  disabled?: boolean
  onClick?: (e: React.MouseEvent) => void | Promise<void>
}

export const SmartButton = forwardRef<HTMLButtonElement, Props>(function SmartButton(
  {
    to,
    type = "button", // Evita submit accidental por defecto
    icon: Icon,
    iconPosition = "left",
    label,
    loadingLabel,
    tooltip,
    children,
    className,
    style,
    onClick,
    variant = "default",
    disabled = false,
  },
  ref
) {
  const [loading, setLoading] = useState(false)

  const handleClick = async (e: React.MouseEvent) => {
    if (type !== "submit") e.preventDefault() // Seguridad extra
    if (disabled || loading || !onClick) return

    const r = onClick(e)
    if (r instanceof Promise) {
      setLoading(true)
      try { await r } finally { setLoading(false) }
    }
  }

  const content = loading ? (
    <>
      <Loader2 className="size-4 animate-spin" />
      {(loadingLabel ?? label ?? children) && (
        <span>{loadingLabel ?? label ?? children}</span>
      )}
    </>
  ) : (
    <>
      {Icon && iconPosition === "left" && <Icon className="size-4" />}
      {(label ?? children) && <span>{label ?? children}</span>}
      {Icon && iconPosition === "right" && <Icon className="size-4" />}
    </>
  )

  const button = (
    <Button
      {...{
        ref,
        type,
        variant,
        asChild: !!to,
        disabled: disabled || loading,
        onClick: handleClick,
        style,
        className: cn(
          label || children || loadingLabel ? "px-3" : "w-9 px-0",
          "rounded-full flex items-center gap-2",
          className
        ),
      }}
    >
      {to ? <Link href={to}>{content}</Link> : content}
    </Button>
  )

  if (!tooltip) return button

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="top">
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  )
})
