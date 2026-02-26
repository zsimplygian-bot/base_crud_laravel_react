// resources/js/pages/Calendario.tsx
import { Head } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import esLocale from "@fullcalendar/core/locales/es"
import { useCallback, memo } from "react"
import { ActionButtons } from "@/components/datatable/base/action-buttons"
import { FORM_CONFIG } from "@/config/forms"
const EventContent = memo(({ arg }: any) => {
  const { mascota, cliente, motivo } = arg.event.extendedProps
  const { view, title, fields } = FORM_CONFIG.cita
  return (
    <div className="flex items-start gap-1 py-1 text-foreground">
      {/* Acciones */}
      <div
        className="flex-shrink-0"
        onClick={e => e.stopPropagation()} // Evita interacción con FullCalendar
        onMouseDown={e => e.stopPropagation()}
      >
        <ActionButtons { ...{ row_id: arg.event.id, view, title, fields, } } />
      </div>
      {/* Texto */}
      <div className="min-w-0 flex-1">
        <div className="truncate text-xs font-semibold">
          {mascota} – {cliente}
        </div>
        <div className="truncate text-[11px] opacity-80">
          {motivo}
        </div>
      </div>
    </div>
  )
})
export default function Calendario() {
  const fetchEvents = useCallback(async (info: any, success: any, failure: any) => {
    try {
      const res = await fetch(`/api/cita/eventos?start=${info.startStr}&end=${info.endStr}`)
      success(await res.json())
    } catch (e) {
      failure(e)
    }
  }, [])
  const renderEvent = useCallback(
    (arg: any) => <EventContent arg={arg} />,
    []
  )
  return (
    <AppLayout breadcrumbs={[{ title: "Calendario de Citas", href: "/cita/calendario" }]}>
      <Head><title>Calendario de Citas</title></Head>
      <div className="p-4">
        <h1 className="mb-4 text-lg font-semibold">CALENDARIO DE CITAS</h1>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale={esLocale}
          height="auto"
          headerToolbar={{ left: "prev,next today", center: "title", right: "" }}
          dayMaxEvents
          events={fetchEvents}
          eventContent={renderEvent}
          eventClassNames={() => ["cursor-pointer"]}
        />
      </div>
    </AppLayout>
  )
}