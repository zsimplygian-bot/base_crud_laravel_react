// components/ui/smart-button.tsx
import { forwardRef } from "react"
import { cn } from "@/lib/utils"
import { Link } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import type { LucideIcon } from "lucide-react"
const KEY = "lp"
type Props = {
  to?: string
  back?: boolean
  save?: boolean
  icon?: LucideIcon
  tooltip?: string
  children?: React.ReactNode
  className?: string
  onClick?: () => void
}
export const SmartButton = forwardRef<HTMLButtonElement, Props>(
  ({ to, back, save, icon: Icon, tooltip, children, className, onClick }, ref) => {
    const href = back
      ? (typeof window !== "undefined" ? localStorage.getItem(KEY) || "/" : "/")
      : to
    const handleClick = () => {
      if (save) {
        localStorage.setItem(KEY, location.pathname + location.search)
      }
      onClick?.()
    }
    const hasLabel = children && String(children).trim()
    const button = (
      <Button
        ref={ref}
        variant={hasLabel ? "default" : "outline"}
        size=""
        className={cn(
                             // ← TODOS 36px de alto
          hasLabel ? "px-3" : "w-9 px-0", // ← con texto: ancho normal | solo icono: cuadrado
          "rounded-full",
          className
        )}
        asChild={!!href}
        onClick={handleClick}
      >
        {href ? (
          <Link href={href} className="flex items-center gap-2">
            {Icon && <Icon className="size-4" />}
            {hasLabel && <span>{children}</span>}
          </Link>
        ) : (
          <>
            {Icon && <Icon className="size-4" />}
            {hasLabel && <span>{children}</span>}
          </>
        )}
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
  }
)
SmartButton.displayName = "SmartButton"