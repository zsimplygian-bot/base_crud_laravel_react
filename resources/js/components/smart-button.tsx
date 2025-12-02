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
  label?: React.ReactNode
  tooltip?: string
  children?: React.ReactNode
  className?: string
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive"
  onClick?: () => void
}

export const SmartButton = forwardRef<HTMLButtonElement, Props>(
  (
    {
      to,
      back,
      save,
      icon: Icon,
      label,
      tooltip,
      children,
      className,
      onClick,
      variant = "outline",
    },
    ref
  ) => {

    const href = back
      ? (typeof window !== "undefined" ? localStorage.getItem(KEY) || "/" : "/")
      : to

    const handleClick = () => {
      if (save) {
        localStorage.setItem(KEY, location.pathname + location.search)
      }
      onClick?.()
    }

    // Detecta si habrá texto visible (label o children)
    const hasLabel =
      (label && String(label).trim()) ||
      (children && String(children).trim())

    // Si tiene label y el dev NO pasó variant explícitamente, se usa "default"
    const computedVariant =
      hasLabel && variant === "outline" ? "default" : variant

    const inner = (
      <>
        {Icon && <Icon className="size-4" />}
        {label && <span>{label}</span>}
        {!label && hasLabel && <span>{children}</span>}
      </>
    )

    const button = (
      <Button
        ref={ref}
        variant={computedVariant}
        size=""
        className={cn(
          hasLabel ? "px-3" : "w-9 px-0",
          "rounded-full flex items-center gap-2",
          className
        )}
        asChild={!!href}
        onClick={handleClick}
      >
        {href ? (
          <Link href={href}>{inner}</Link>
        ) : (
          inner
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
