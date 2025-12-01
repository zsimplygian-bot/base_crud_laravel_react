// components/ui/NavigationButtons.tsx
import { ReactNode } from "react";
import { Link, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
const LOCAL_STORAGE_KEY = "lastPage";
// --- ForwardButton: marca la página actual y va a otra URL ---
interface ForwardButtonProps {
  href: string;
  label: string;
  icon?: ReactNode;
  className?: string;
}
export function ForwardButton({ href, label, icon, className }: ForwardButtonProps) {
  const { url } = usePage();
  const markEntry = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, url);
  };
  return (
    <Link href={href} onClick={markEntry}>
      <Button size="sm" variant="outline" className={`gap-1 text-sm ${className || ""}`}>
        {icon}
        {label}
      </Button>
    </Link>
  );
}
// --- BackwardButton: va a la última página marcada ---
interface BackwardButtonProps {
  label: string;
  icon?: ReactNode;
  className?: string;
  fallback?: string; // URL si no hay historial
}
export function BackwardButton({ label, icon, className, fallback = "/" }: BackwardButtonProps) {
  const lastPage = typeof window !== "undefined" ? localStorage.getItem(LOCAL_STORAGE_KEY) : null;
  return (
    <Link href={lastPage || fallback}>
      <Button size="sm" variant="outline" className={`gap-1 text-sm ${className || ""}`}>
        {icon || <ArrowLeft className="w-4 h-4 opacity-80 hover:opacity-100 transition" />}
        {label}
      </Button>
    </Link>
  );
}