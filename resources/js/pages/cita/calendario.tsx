import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
export default function Calendario() {
  return (
    <AppLayout breadcrumbs={[{ title: "Calendario de Citas", href: "/cita/calendario" }]}>
      <Head>
        <title>Calendario de Citas</title>
      </Head>
      <div className="p-4">
        <h1 className="text-lg font-semibold">CALENDARIO DE CITAS</h1>
        <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale={esLocale}
        height="auto"
        selectable
        editable
        events={async (info, success, failure) => {
          try {
            const res = await fetch(`/api/cita/eventos?start=${info.startStr}&end=${info.endStr}`);
            const data = await res.json();
            success(data);
          } catch (e) {
            failure(e);
          }
        }}
        dateClick={(info) => console.log(info.dateStr)}
        eventClick={(info) => console.log(info.event)}
        eventDrop={(info) => console.log(info.event)}
      />
      </div>
    </AppLayout>
  );
}