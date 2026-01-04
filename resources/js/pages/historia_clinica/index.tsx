import { DataTableLayout } from "@/layouts/datatable-layout";
const view = "historia_clinica";
const title = "Historias Clínicas";
const formFields = {
  fields: [
    { id: "id_mascota", label: "Mascota - Dueño", type: "combobox" },
    { id: "fecha", label: "Fecha", type: "date", required: true },
    { id: "id_motivo_historia_clinica", label: "Motivo historia", type: "combobox" },
    { id: "detalle", label: "Detalle", type: "textarea" },
    { id: "observaciones", label: "Observaciones", type: "textarea" },
    { id: "id_estado_historia_clinica", label: "Estado", type: "combobox" },
  ],
};
const searchFields = formFields.fields.map(f => ({ ...f }));
export default function DatatablePage() {
  return <DataTableLayout {...{ view, title, formFields, searchFields }} />;
}