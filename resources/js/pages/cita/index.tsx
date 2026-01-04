// DatatablePage.tsx
import { DataTableLayout } from "@/layouts/datatable-layout";
const view = "cita";
const title = "Cita";
const formFields = {
  fields: [
    { id: "id_mascota", label: "Mascota", type: "combobox" },
    { id: "id_motivo_cita", label: "Motivo cita", type: "combobox" },
    { id: "fecha", label: "Fecha", type: "date" },
    { id: "hora", label: "Hora", type: "time" },
    { id: "observaciones", label: "Observaciones" },
    { id: "id_estado_cita", label: "Estado cita", type: "combobox" },
  ]
};
const searchFields = formFields.fields.map(f => ({ ...f }));
export default function DatatablePage() {
  return <DataTableLayout {...{ view, title, formFields, searchFields }} />;
}