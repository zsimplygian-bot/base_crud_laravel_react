export const historia_clinicaForm = {
  view: "historia_clinica",
  title: "Historias Clínicas",

  fields: [
    { id: "id_mascota", label: "Mascota - Dueño", type: "combobox", searchable: true, defaultVisible: true },
    { id: "fecha", label: "Fecha", type: "datetime", required: true },
    { id: "id_motivo", label: "Motivo historia", type: "combobox", searchable: true, defaultVisible: true },
    { id: "detalle", label: "Detalle", type: "textarea" },
    { id: "observaciones", label: "Observaciones", type: "textarea" },
    { id: "id_estado_historia_clinica", label: "Estado", type: "combobox", default: "1", searchable: true },
  ],

  footerFields: {
    fields: [
      {
        id: "total",
        label: "Total S/.",
        sum: true,
        accessor: row => Number(row.precio),
      },
    ],
  },

  extendedFields: {
    header: "Información clínica adicional",
    footer: "Verifique los datos antes de guardar",

    seguimientoFields: {
      title: "Seguimiento",
      view: "historia_clinica_seguimiento",
      fields: [
        { id: "id_historia_clinica", hidden: true },
        { id: "detalle", label: "Detalle", type: "textarea" },
        { id: "observaciones", label: "Observaciones" },
        { id: "fecha", label: "Fecha", type: "datetime" },
        { id: "archivo", label: "Imagen", type: "file" },
      ],
      recordFields: [
        { id: "detalle", label: "Detalle" },
        { id: "observaciones", label: "Observaciones" },
      ],
    },

    productoFields: {
      title: "Productos",
      view: "historia_clinica_producto",
      fields: [
        { id: "id_historia_clinica", hidden: true },
        { id: "id_producto", label: "Producto", type: "combobox" },
        { id: "dosis", label: "Dosis" },
        { id: "precio", label: "Precio S/", type: "number" },
        { id: "fecha", label: "Fecha", type: "datetime" },
        { id: "archivo", label: "Imagen", type: "file" },
      ],
      recordFields: [
        { id: "nombre_producto", label: "Producto" },
        { id: "dosis", label: "Dosis" },
        { id: "precio", label: "Precio S/" },
      ],
    },

    procedimientoFields: {
      title: "Procedimientos",
      view: "historia_clinica_procedimiento",
      fields: [
        { id: "id_historia_clinica", hidden: true },
        { id: "id_procedimiento", label: "Procedimiento", type: "combobox" },
        { id: "detalle", label: "Detalle" },
        { id: "precio", label: "Precio S/", type: "number" },
        { id: "fecha", label: "Fecha", type: "datetime" },
        { id: "archivo", label: "Imagen", type: "file" },
      ],
      recordFields: [
        { id: "nombre_procedimiento", label: "Procedimiento" },
        { id: "detalle", label: "Detalle" },
        { id: "precio", label: "Precio S/" },
      ],
    },

    anamnesisFields: {
      title: "Anamnesis",
      view: "historia_clinica_anamnesis",
      fields: [
        { id: "id_historia_clinica", hidden: true },
        { id: "fecha", label: "Fecha", type: "datetime" },
        { id: "temperatura", label: "Temperatura (°C)", type: "number" },
        { id: "frecuencia_cardiaca", label: "Frecuencia cardiaca (lpm)", type: "number" },
        { id: "frecuencia_respiratoria", label: "Frecuencia respiratoria (rpm)", type: "number" },
        { id: "tiempo_llenado_capilar", label: "Tiempo llenado capilar (seg)", type: "number" },
        { id: "peso", label: "Peso (kg)", type: "number" },
        { id: "archivo", label: "Imagen", type: "file" },
      ],
      recordFields: [
        { id: "fecha", label: "Fecha", type: "date" },
        { id: "hora", label: "Hora", type: "time" },
        { id: "temperatura", label: "Temperatura (°C)" },
        { id: "frecuencia_cardiaca", label: "Frecuencia cardiaca (lpm)" },
        { id: "frecuencia_respiratoria", label: "Frecuencia respiratoria (rpm)" },
        { id: "tiempo_llenado_capilar", label: "Tiempo llenado capilar (seg)" },
        { id: "peso", label: "Peso (kg)" },
      ],
    },
  },
}
