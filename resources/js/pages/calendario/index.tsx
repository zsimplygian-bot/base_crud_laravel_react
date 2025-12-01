// resources/js/pages/Calendario.tsx
import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import { useEffect, useRef, useState, useMemo } from "react";
import { CopyIcon, EyeIcon, EditIcon, TrashIcon } from "lucide-react";
import { ForwardButton } from "@/components/navigation-button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import WhatsAppButton from "@/components/whatsapp-button";

export default function Calendario() {
  const containerRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<FullCalendar>(null);

  // Estado del menú contextual
  const [menu, setMenu] = useState<{ x: number; y: number; event: any } | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [detalleData, setDetalleData] = useState<any>(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  // === ABRIR MENÚ (LA CLAVE ESTÁ AQUÍ) ===
  const handleEventClick = (info: any) => {
    // ¡NO usar preventDefault ni stopPropagation aquí!
    // FullCalendar necesita que el evento fluya para no recargar
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = info.jsEvent.clientX - rect.left;
    const y = info.jsEvent.clientY - rect.top;

    setMenu({
      x,
      y: y + 5, // pequeño offset para que no quede pegado al cursor
      event: info.event,
    });

    // Evitamos que el click se propague al documento inmediatamente
    info.jsEvent.stopPropagation();
  };

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    if (!menu) return;
    const handleClickOutside = () => setMenu(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menu]);

  // === CARGAR EVENTOS (solo al cambiar mes) ===
  const fetchEvents = useMemo(
    () => async (fetchInfo: any, successCallback: any, failureCallback: any) => {
      try {
        const res = await fetch(
          `/api/cita/eventos?start=${fetchInfo.startStr}&end=${fetchInfo.endStr}`
        );
        const data = await res.json();
        successCallback(data);
      } catch (err) {
        console.error("Error cargando eventos:", err);
        failureCallback(err);
      }
    },
    []
  );

  const openDetalle = async (id: number) => {
    setDialogOpen(true);
    setLoadingDetalle(true);
    try {
      const res = await fetch(`/api/cita/${id}/info`);
      const data = await res.json();
      setDetalleData(data);
    } catch (err) {
      setDetalleData(null);
    } finally {
      setLoadingDetalle(false);
    }
  };

  const formatFecha = (fecha: string | null) =>
    fecha ? new Date(fecha).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" }) : "-";

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
          editable={false}
          selectable={false}
          selectMirror={false}
          dayMaxEvents={true}

          events={fetchEvents}

          // AQUÍ ESTÁ LA MAGIA: solo stopPropagation, NADA MÁS
          eventClick={handleEventClick}

          eventClassNames={(arg) => {
            const motivoId = arg.event.extendedProps.id_motivo_cita;
            const base = ["rounded-md px-2 py-1 leading-tight cursor-pointer border"];
            return motivoId === 1
              ? [...base, "bg-gray-200 border-gray-300 text-gray-900 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200"]
              : [...base, "bg-gray-300 border-gray-400 text-gray-900 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-100"];
          }}

          eventContent={(arg) => {
            const { mascota, cliente, motivo, fecha } = arg.event.extendedProps;
            const fechaFmt = fecha ? new Date(fecha).toLocaleDateString("es-ES") : "";
            return {
              html: `
                <div class="text-[13px] leading-tight">
                  <div class="font-semibold truncate">${mascota || ""} – ${cliente || ""}</div>
                  <div class="truncate">${motivo || ""} ${fechaFmt}</div>
                </div>
              `,
            };
          }}
        />

        {/* MENÚ CONTEXTUAL */}
        {menu && (
          <div
            className="absolute z-50 w-48 py-2 rounded-lg shadow-2xl border bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700"
            style={{ top: menu.y, left: menu.x }}
            onClick={(e) => e.stopPropagation()} // evita cerrar al hacer click dentro del menú
          >
            <MenuItem icon={CopyIcon} label="Copiar ID" onClick={() => {
              navigator.clipboard.writeText(menu.event.id.toString());
              setMenu(null);
            }} />

            <MenuItem icon={EyeIcon} label="Ver detalle" onClick={() => {
              openDetalle(menu.event.id);
              setMenu(null);
            }} />

            <ForwardButton
              href={`/cita/form/update/${menu.event.id}`}
              label="Editar"
              icon={<EditIcon className="w-4 h-4 text-green-600" />}
              className="w-full justify-start px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-neutral-800"
              onClick={() => setMenu(null)}
            />

            <ForwardButton
              href={`/cita/form/delete/${menu.event.id}`}
              label="Eliminar"
              icon={<TrashIcon className="w-4 h-4 text-red-600" />}
              className="w-full justify-start px-4 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600"
              onClick={() => setMenu(null)}
            />
          </div>
        )}

        {/* DIÁLOGO DETALLE */}
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
                <p><strong>Fecha notificación:</strong> {detalleData.fecha_hora_notificacion || "-"}</p>
                <p><strong>Motivo:</strong> {detalleData.motivo_cita}</p>
                <p><strong>Estado:</strong> {detalleData.estado}</p>
                {detalleData.observaciones && (
                  <div className="p-3 bg-gray-50 dark:bg-neutral-800 rounded">
                    <strong>Observaciones:</strong><br />{detalleData.observaciones}
                  </div>
                )}
                {/* Dentro del Dialog, donde muestras el detalle */}
<div className="mt-6">
  <WhatsAppButton
    telefono={detalleData.telefono}
    mensaje={`Hola ${detalleData.cliente}, te recordamos tu cita con ${detalleData.mascota} el ${formatFecha(detalleData.fecha)} a las ${detalleData.hora || "-"}. Motivo: ${detalleData.motivo_cita}`}
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

function MenuItem({ icon: Icon, label, onClick }: { icon: any; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}