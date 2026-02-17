// mascota.config.ts
export const citaForm = {
  view: "cita",
  title: "Cita",
  fields: [
    { id: "id_mascota", label: "Mascota", type: "combobox", searchable: true, defaultVisible: true },
    { id: "id_motivo", label: "Motivo cita", type: "combobox", searchable: true, defaultVisible: true },
    { id: "fecha", label: "Fecha", type: "datetime", searchable: true, },
    { id: "observaciones", label: "Observaciones", searchable: true, },
    { id: "id_estado_cita", label: "Estado cita", type: "combobox", default: "1" },
  ],
}
