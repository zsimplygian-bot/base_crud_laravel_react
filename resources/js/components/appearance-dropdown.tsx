import { HTMLAttributes, useMemo } from "react";
import { SmartDropdown, SDItem } from "@/components/smart-dropdown";
import { useAppearance } from "@/hooks/use-appearance";
import { Monitor, Moon, Sun } from "lucide-react";
export default function AppearanceToggleDropdown({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const { appearance, updateAppearance } = useAppearance();
  const CurrentIcon = useMemo(() => {
    return appearance === "dark"
      ? Moon
      : appearance === "light"
      ? Sun
      : Monitor;
  }, [appearance]);
  const items: SDItem[] = useMemo(
    () => [
      { label: "Claro", icon: Sun, action: () => updateAppearance("light") },
      { label: "Oscuro", icon: Moon, action: () => updateAppearance("dark") },
      { label: "Sistema", icon: Monitor, action: () => updateAppearance("system") },
    ],
    [updateAppearance]
  );
  return (
    <div className={className} {...props}>
      <SmartDropdown label="Cambiar tema" triggerIcon={CurrentIcon} triggerVariant="ghost" items={items} />
    </div>
  );
}