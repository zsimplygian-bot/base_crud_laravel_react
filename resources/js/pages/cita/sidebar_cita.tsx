import { useEffect, useRef, useMemo, memo } from "react";
import DropdownMenuBase from "@/components/dropdown-menu-base";
import { Button } from "@/components/ui/button";
import { Clock, Edit2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useApi } from "@/hooks/use-api";
import { TooltipBase } from "@/components/tooltip-base";
import { router } from "@inertiajs/react";
// Reglas estáticas (no se recalculan nunca)
const DAY_RULES = [
  { max: 0, type: "error", label: "hoy" },
  { max: 1, type: "warning", label: "mañana" },
  { max: 3, type: "info", label: "en pocos días" },
];
function getDayAlert(diffDays, c) {
  const rule = DAY_RULES.find(r => diffDays <= r.max);
  return rule
    ? { type: rule.type, msg: `Cita con ${c.mascota} (${c.cliente}) es ${rule.label}` }
    : null;
}
const CitaItem = memo(function CitaItem({ cita, baseUrl }) {
  function handleAtender() {
    router.post(`${baseUrl}/cita/atender/${cita.id}`);
  }
  return (
    <div className="flex items-center justify-between px-2 py-2 rounded-md select-none pointer-events-none">
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="w-4 h-4 text-blue-500" />
          <span className="font-medium text-sm truncate">{cita.mascota}</span>
          <span className="text-xs text-muted-foreground">— {cita.cliente}</span>
        </div>
        <div className="text-xs">
          {cita.motivo_cita} — {cita.displayDate}
        </div>
      </div>
      <div className="flex items-center gap-1 ml-2 pointer-events-auto">
        <TooltipBase
          as="link"
          href={`${baseUrl}/cita/form/update/${cita.id}`}
          content="Editar"
          icon={Edit2}
          className="h-7 w-7 text-green-600"
          side="left"
        />
        <TooltipBase
          as="button"
          onClick={handleAtender}
          content="Atender"
          icon={CheckCircle}
          className="h-7 w-7 text-blue-600"
          side="left"
        />
      </div>
    </div>
  );
});
export default function CitasDropdown() {
  const baseUrl = import.meta.env.VITE_APP_URL || "";
  // SIN interval → usa el default del hook (10s)
  const { data: citasApi } = useApi(`${baseUrl}/api/citas/proximas`, {
    autoFetch: true,
    method: "GET",
    initialData: [],
  });
  const notified = useRef(new Set());
  const citas = useMemo(() => {
    if (!Array.isArray(citasApi) || !citasApi.length) return [];
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return citasApi.map(c => {
      const fecha = new Date(`${c.fecha}T00:00:00`);
      const diffDays = Math.floor((fecha - startOfToday) / 86400000);
      return {
        ...c,
        diffDays,
        alert: getDayAlert(diffDays, c),
        displayDate: `${c.fecha} ${c.hora.slice(0, 5)}`,
      };
    });
  }, [citasApi]);
  // Notificaciones solo cuando llegan nuevas citas
  useEffect(() => {
    for (const c of citas) {
      if (c.alert && !notified.current.has(c.id)) {
        toast[c.alert.type](c.alert.msg);
        notified.current.add(c.id);
      }
    }
  }, [citas]);
  const items = useMemo(() => {
    if (!citas.length) {
      return [
        {
          custom: (
            <div className="text-xs text-muted-foreground px-2 py-1">
              Sin citas próximas
            </div>
          ),
        },
      ];
    }
    return citas.map(c => ({
      custom: <CitaItem key={c.id} cita={c} baseUrl={baseUrl} />,
    }));
  }, [citas, baseUrl]);
  return (
    <DropdownMenuBase
      trigger={
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md relative">
          <Clock className="w-4 h-4" />
          {citas.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center">
              {citas.length}
            </span>
          )}
        </Button>
      }
      label="Citas próximas"
      align="end"
      closeOnSelect={false}
      itemHover={false}
      items={items}
    />
  );
}