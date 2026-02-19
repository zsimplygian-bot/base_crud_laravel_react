// mascota.config.ts
export const mascotaForm = {
  view: "mascota",
  title: "Mascota",
  fields: [
    { id: "mascota", label: "Mascota", required: true, searchable: true, defaultVisible: true, width:"1/2" },
    { id: "id_cliente", label: "Cliente", type: "combobox", searchable: true, defaultVisible: true, width:"1/2" },
    { id: "id_raza", label: "Raza", type: "combobox", searchable: true, defaultVisible: true, width:"1/2" },
    { id: "id_sexo", label: "Sexo", type: "combobox", searchable: true, defaultVisible: true, width:"1/2" },
    { id: "fecha_nacimiento", label: "Fecha de nacimiento", type: 'date', searchable: true, width:"1/2" },
    { id: "fecha_nacimiento_estimada", label: "Fecha nacimiento es estimada?", type: "checkbox", default: false, width:"1/2" },
    { id: "color", label: "Color", searchable: true, width:"1/2" },
    { id: "peso", label: "Peso", searchable: true, width:"1/2" },
    { id: "activo", label: "Se encuentra activo?", type: "checkbox", default: true, width:"1/2" },
    { id: "observaciones", label: "Observaciones", type: "textarea", searchable: true, width:"1/2" },
    { id: "archivo", label: "Imagen", type: "file" },
  ],
}