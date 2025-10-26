import { useEffect, useRef, useState } from "react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Clock } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface Cita {
  id: number;
  mascota: string;
  cliente: string;
  motivo_cita: string;
  fecha_hora: string;
}

export default function SidebarCitas({ collapsed = false }: { collapsed?: boolean }) {
  const [citas, setCitas] = useState<Cita[]>([]);
  const notified = useRef<Set<number>>(new Set());

  const fetchCitas = async () => {
    try {
      const { data } = await axios.get<Cita[]>("/api/citas/proximas");
      setCitas(data);

      data.forEach((c) => {
        if (notified.current.has(c.id)) return;
        const diff = (new Date(c.fecha_hora).getTime() - Date.now()) / 60000;
        let msg: string | null = null;
        if (diff <= 60 && diff > 30)
          msg = `Cita con ${c.mascota} (${c.cliente}) en menos de 1 hora`;
        else if (diff <= 30 && diff > 10)
          msg = `Cita con ${c.mascota} (${c.cliente}) en menos de 30 minutos`;
        else if (diff <= 10 && diff > 0)
          msg = `Cita con ${c.mascota} (${c.cliente}) en menos de 10 minutos`;

        if (msg) {
          const type = diff <= 10 ? "error" : diff <= 30 ? "warning" : "info";
          toast[type](msg);
          notified.current.add(c.id);
        }
      });
    } catch {
      console.warn("Error al obtener citas próximas");
    }
  };

  useEffect(() => {
    fetchCitas();
    const interval = setInterval(fetchCitas, 300000);
    return () => clearInterval(interval);
  }, []);

  const renderCitaButton = (c: Cita) => (
    <SidebarMenuItem key={c.id} className="min-w-0">
      <SidebarMenuButton
        asChild
        className={`
          !h-auto !items-start py-2 px-2 transition-colors rounded-md w-full min-w-0
          hover:bg-accent hover:text-accent-foreground
          focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
          disabled:pointer-events-none disabled:opacity-50
          ${collapsed ? "justify-center" : "justify-start"}
        `}
      >
        <div className="flex flex-col gap-1 text-sm min-w-0 overflow-hidden">
          <div className="flex items-center gap-2 min-w-0">
            <Clock className="w-4 h-4 text-blue-500 flex-shrink-0" />
            {!collapsed && (
              <>
                <span className="font-medium truncate">{c.mascota}</span>
                <span className="text-xs text-muted-foreground truncate">
                  ({c.cliente})
                </span>
              </>
            )}
          </div>
          {!collapsed && (
            <>
              <span className="text-xs text-muted-foreground truncate">
                {c.motivo_cita}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {new Date(c.fecha_hora).toLocaleString("es-PE", {
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "2-digit",
                  month: "short",
                })}
              </span>
            </>
          )}
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  return (
    <SidebarGroup className="px-2 py-1 min-w-0 flex flex-col flex-1 min-h-0">
      <SidebarGroupLabel className="truncate">Citas próximas</SidebarGroupLabel>

      {citas.length === 0 ? (
        <p className="text-xs text-muted-foreground truncate px-1 mt-1">
          Sin citas próximas
        </p>
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto mt-1">
          <SidebarMenu className="flex flex-col gap-1 min-w-0">
            {citas.map((c) =>
              collapsed ? (
                <TooltipProvider key={c.id} delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>{renderCitaButton(c)}</TooltipTrigger>
                    <TooltipContent
                      side="right"
                      align="center"
                      className="text-foreground"
                    >
                      <p className="text-sm font-medium">{c.mascota}</p>
                      <p className="text-xs">{c.cliente}</p>
                      <p className="text-xs">{c.motivo_cita}</p>
                      <p className="text-xs">
                        {new Date(c.fecha_hora).toLocaleString("es-PE")}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                renderCitaButton(c)
              )
            )}
          </SidebarMenu>
        </div>
      )}
    </SidebarGroup>
  );
}
