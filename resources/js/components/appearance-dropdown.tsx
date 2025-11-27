import { HTMLAttributes } from "react";
import { Button } from "@/components/ui/button";
import DropdownMenuBase, { DItem } from "@/components/dropdown-menu-base";
import { useAppearance } from "@/hooks/use-appearance";
import { Monitor, Moon, Sun } from "lucide-react";
export default function AppearanceToggleDropdown({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const { appearance, updateAppearance } = useAppearance();
  const iconCurrent =
    appearance === "dark" ? (
      <Moon className="h-5 w-5" />
    ) : appearance === "light" ? (
      <Sun className="h-5 w-5" />
    ) : (
      <Monitor className="h-5 w-5" />
    );
  const items: DItem[] = [
    { label: "Claro", icon: Sun, action: () => updateAppearance("light"), },
    { label: "Oscuro", icon: Moon, action: () => updateAppearance("dark"), },
    { label: "Sistema", icon: Monitor, action: () => updateAppearance("system"), },
  ];
  return (
    <div className={className} {...props}>
      <DropdownMenuBase
        trigger={
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md">
            {iconCurrent}
            <span className="sr-only">Toggle theme</span>
          </Button>
        }
        items={items}
        align="end"
      />
    </div>
  );
}