// resources/js/pages/Calendario.tsx
import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import { useEffect, useRef, useState, useCallback, memo } from "react";
import { CopyIcon, EyeIcon, EditIcon, TrashIcon, BellIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import WhatsAppButton from "@/components/whatsapp-button";
import { SmartButton } from "@/components/smart-button";
interface MenuState {
  x: number;
  y: number;
  event: any;
}
const MenuContextual = memo(({ menu, closeMenu, openDetalle }: { menu: MenuState; closeMenu: () => void; openDetalle: (id: number) => void }) => {
  if (!menu) return null;
  // Ajuste para que no se salga de la pantalla
  const maxWidth = 200;
  const left = menu.x + maxWidth > window.innerWidth ? window.innerWidth - maxWidth - 8 : menu.x;
  return (
    <div
      className="absolute z-50 w-48 rounded-lg shadow-xl border bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700"
      style={{ top: menu.y, left }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-2 py-1">
        <SmartButton
          variant="ghost"
          icon={CopyIcon}
          className="w-full justify-start text-sm"
          label="Copiar ID"
          onClick={() => {
            navigator.clipboard.writeText(menu.event.id.toString());
            closeMenu();
          }}
        />
        <SmartButton
          variant="ghost"
          icon={EyeIcon}
          className="w-full justify-start text-sm text-blue-600"
          label="Detalle"
          onClick={() => {
            openDetalle(menu.event.id);
            closeMenu();
          }}
        />
        <SmartButton
          to={`/cita/form/update/${menu.event.id}`}
          variant="ghost"
          icon={EditIcon}
          className="w-full justify-start text-sm text-green-600"
          label="Editar"
          onClick={closeMenu}
        />
        <SmartButton
          to={`/cita/form/delete/${menu.event.id}`}
          variant="ghost"
          icon={TrashIcon}
          className="w-full justify-start text-sm text-red-600"
          label="Eliminar"
          onClick={closeMenu}
        />
      </div>
    </div>
  );
});
export default function Calendario() {
  const containerRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<FullCalendar>(null);
  const [menu, setMenu] = useState<MenuState | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detalleData, setDetalleData] = useState<any>(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const handleEventClick = useCallback((info: any) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = info.jsEvent.clientX - rect.left;
    const y = info.jsEvent.clientY - rect.top;
    setMenu({ x, y: y + 6, event: info.event });
    info.jsEvent.stopPropagation();
  }, []);
  useEffect(() => {
    if (!menu) return;
    const close = () => setMenu(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [menu]);
  const fetchEvents = useCallback(async (info: any, success: any, failure: any) => {
    try {
      const res = await fetch(`/api/cita/eventos?start=${info.startStr}&end=${info.endStr}`);
      success(await res.json());
    } catch (e) {
      failure(e);
    }
  }, []);
  const openDetalle = useCallback(async (id: number) => {
    setDialogOpen(true);
    setLoadingDetalle(true);
    try {
      const res = await fetch(`/api/cita/${id}/info`);
      setDetalleData(await res.json());
    } catch {
      setDetalleData(null);
    } finally {
      setLoadingDetalle(false);
    }
  }, []);
  const formatFecha = useCallback((fecha: string | null) =>
    fecha ? new Date(fecha).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" }) : "-", []
  );
  const eventContent = useCallback((arg: any) => {
  const { mascota, cliente, motivo, fecha, id_estado_cita, fecha_hora_notificacion } = arg.event.extendedProps;
  const fechaFmt = fecha ? new Date(fecha).toLocaleDateString("es-ES") : "";
  const estadoClasses: Record<number, string> = {
    1: "bg-green-900", // PENDIENTE
    2: "bg-green-700", // ATENDIDO
    3: "bg-red-500",   // CANCELADO
  };
  const blockColor = estadoClasses[id_estado_cita] || "bg-gray-700"; // gris oscuro neutro
  return (
    <div className={`rounded p-1 ${blockColor} cursor-pointer max-w-full overflow-hidden`}>
      <div className="flex items-center justify-between font-semibold text-white truncate">
        <span className="truncate">{mascota || ""} – {cliente || ""}</span>
        {fecha_hora_notificacion && fecha_hora_notificacion !== "0000-00-00 00:00:00" && (
          <BellIcon className="w-4 h-4 ml-1 flex-shrink-0" />
        )}
      </div>
      <div className="text-white truncate text-xs sm:text-sm">
        {motivo || ""} {fechaFmt}
      </div>
    </div>
  );
}, []);
  return (
    <AppLayout breadcrumbs={[{ title: "Calendario de Citas", href: "/cita/calendario" }]}>
      <Head><title>Calendario de Citas</title></Head>
      <div ref={containerRef} className="p-4 relative">
        <h1 className="text-lg font-semibold mb-4">CALENDARIO DE CITAS</h1>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale={esLocale}
          height="auto"
          headerToolbar={{ left: "prev,next today", center: "title", right: "" }}
          dayMaxEvents
          events={fetchEvents}
          eventClick={handleEventClick}
          eventClassNames={() => ["cursor-pointer"]}
          eventContent={eventContent}
        />
        <MenuContextual menu={menu} closeMenu={() => setMenu(null)} openDetalle={openDetalle} />
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Detalle de Cita</DialogTitle>
              <DialogClose />
            </DialogHeader>
            {loadingDetalle ? (
              <p className="py-8 text-center">Cargando...</p>
            ) : detalleData ? (
              <div className="space-y-3 text-sm">
                <p><strong>ID:</strong> {detalleData.id}</p>
                <p><strong>Mascota:</strong> {detalleData.mascota}</p>
                <p><strong>Dueño:</strong> {detalleData.cliente}</p>
                <p><strong>Fecha:</strong> {formatFecha(detalleData.fecha)}</p>
                <p><strong>Hora:</strong> {detalleData.hora || "-"}</p>
                <p><strong>Notificación:</strong> {detalleData.fecha_hora_notificacion || "-"}</p>
                <p><strong>Motivo:</strong> {detalleData.motivo_cita}</p>
                <p><strong>Estado:</strong> {detalleData.estado}</p>

                {detalleData.observaciones && (
                  <div className="p-3 rounded bg-neutral-200 dark:bg-neutral-800">
                    <strong>Observaciones:</strong><br />{detalleData.observaciones}
                  </div>
                )}
                <div className="mt-6">
                  <WhatsAppButton
                    telefono={detalleData.telefono}
                    mensaje={`Hola ${detalleData.cliente}, te invitamos a una cita con ${detalleData.mascota} el ${detalleData.fecha} a alrededor de las ${detalleData.hora || "-"}. Motivo: ${detalleData.motivo_cita}`}
                    citaId={detalleData.id}
                  />
                </div>
              </div>
            ) : (
              <p className="py-8 text-center text-red-600">No se encontró la cita.</p>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}