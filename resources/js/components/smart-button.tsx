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
  icon?: LucideIcon // Compatibilidad
  icons?: LucideIcon[] // Extension
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
  onClick?: (e: React.MouseEvent) => void | Promise<void>
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
  },
  ref
) {
  const [loading, setLoading] = useState(false)
  const handleClick = async (e: React.MouseEvent) => {
  if (!to && type !== "submit") e.preventDefault() // No bloquear navegación cuando hay to
  if (disabled || loading || !onClick) return
  const r = onClick(e)
  if (r instanceof Promise) {
    setLoading(true)
    try { await r } finally { setLoading(false) }
  }
}
  const finalIcons = icon ? [icon, ...icons] : icons // Icon legacy + iconos extra
  const hasText = !!(label || children || loadingLabel)
  const isIconOnlySingle = !hasText && finalIcons.length === 1
  const IconsEl = finalIcons.length > 0 && (
    <span className="flex items-center gap-1">
      {finalIcons.map((Icon, i) => (
        <Icon key={i} style={{ width: iconSize, height: iconSize }} /> // Render uniforme
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
  const button = (
    <Button {...{ ref, type, variant, asChild: !!to, disabled: disabled || loading, onClick: handleClick,
        style, className: cn( isIconOnlySingle ? "w-9 px-0" : "px-2", // Ancho inteligente
          "rounded-full flex items-center gap-2", className ), }} >
      {to ? <Link href={to}>{content}</Link> : content}
    </Button>
  )
  if (!tooltip) return button
  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="top"><p>{tooltip}</p></TooltipContent>
    </Tooltip>
  )
})