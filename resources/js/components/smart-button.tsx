import { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Loader2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const KEY = "lp";

type Props = {
  to?: string;
  back?: boolean;
  save?: boolean;
  icon?: LucideIcon;
  iconPosition?: "left" | "right"; // default: left
  label?: React.ReactNode;
  loadingLabel?: React.ReactNode;
  tooltip?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties; // ← NUEVO (custom styles)
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive";
  disabled?: boolean;
  onClick?: () => void | Promise<void>;
};

export const SmartButton = forwardRef<HTMLButtonElement, Props>((
  {
    to,
    back,
    save,
    icon: Icon,
    iconPosition = "left",
    label,
    loadingLabel,
    tooltip,
    children,
    className,
    style, // ← aquí
    onClick,
    variant = "default",
    disabled = false,
  },
  ref
) => {
  const [loading, setLoading] = useState(false);

  const href = back
    ? typeof window !== "undefined"
      ? localStorage.getItem(KEY) || "/"
      : "/"
    : to;

  const handleClick = async () => {
    if (disabled || loading || !onClick) return;
    if (save) localStorage.setItem(KEY, location.pathname + location.search);
    try {
      const result = onClick();
      if (result instanceof Promise) {
        setLoading(true);
        await result;
      }
    } finally {
      setLoading(false);
    }
  };

  const hasLabel = !!(label || loadingLabel || (children && String(children).trim()));

  const iconNode = loading
    ? <Loader2 className="size-4 animate-spin" />
    : Icon && <Icon className="size-4" />;

  const textNode =
    (label || children || loadingLabel) && (
      <span>
        {loading ? loadingLabel ?? label ?? children : label ?? children}
      </span>
    );

  const inner = (
    <>
      {iconPosition === "left" && iconNode}
      {textNode}
      {iconPosition === "right" && iconNode}
    </>
  );

  const button = (
    <Button
      ref={ref}
      variant={variant}
      size=""
      asChild={!!href}
      disabled={disabled || loading}
      onClick={handleClick}
      style={style} // ← aplicado aquí
      className={cn(
        hasLabel ? "px-3" : "w-9 px-0",
        "rounded-full flex items-center gap-2",
        className
      )}
    >
      {href ? <Link href={href}>{inner}</Link> : inner}
    </Button>
  );

  if (!tooltip) return button;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="top">
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
});

SmartButton.displayName = "SmartButton";
