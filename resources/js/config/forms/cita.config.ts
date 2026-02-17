// mascota.config.ts
export const citaForm = {
  view: "cita",
  title: "Cita",
  fields: [
    { id: "id_mascota", label: "Mascota", type: "combobox" },
    { id: "id_motivo", label: "Motivo cita", type: "combobox" },
    { id: "fecha", label: "Fecha", type: "datetime" },
    { id: "observaciones", label: "Observaciones" },
    { id: "id_estado_cita", label: "Estado cita", type: "combobox", default: "1" },
  ],
}
