import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
export function TooltipBase({
  content,
  as = "button",
  href,
  onClick,
  icon: Icon,
  variant = "ghost",
  size = "icon",
  className = "",
  side = "left",
}: any) {
  const Child =
    as === "link"
      ? (
          <Link href={href}>
            <Button variant={variant} size={size} onClick={onClick} className={className}>
              {Icon && <Icon className="h-4 w-4" />}
            </Button>
          </Link>
        )
      : (
          <Button variant={variant} size={size} onClick={onClick} className={className}>
            {Icon && <Icon className="h-4 w-4" />}
          </Button>
        );
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {Child}
        </TooltipTrigger>
        <TooltipContent side={side}>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}