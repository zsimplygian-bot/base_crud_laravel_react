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
    { id: "id_estado_historia_clinica", label: "Estado", type: "combobox", default: "1" },
  ],
};
const searchFields = formFields.fields.map(f => ({
  ...f,
  defaultVisible: [ "id_mascota", "id_motivo_historia_clinica", "id_estado_historia_clinica",
  ].includes(f.id),
}));
const footerFields = {
  fields: [
    { id: "total", label: "Total S/.", sum: true, accessor: row => Number(row.precio), },
  ],
};
const extendedFields = {
  header: "Información clínica adicional",
  footer: "Verifique los datos antes de guardar",
  seguimientoFields: {
  title: "Seguimiento",
  view: "historia_clinica_seguimiento",
  fields: [
    { id: "id_historia_clinica", label: "Historia clínica", hidden: true },
    { id: "detalle", label: "Detalle", type: "textarea" },
    { id: "observaciones", label: "Observaciones"},
    { id: "fecha", label: "Fecha", type: "datetime" },
    { id: "archivo", label: "Imagen", type: "file" },
  ],
  recordFields: [
    { id: "detalle", label: "Detalle" },
    { id: "observaciones", label: "Observaciones" },
  ]},
  medicamentoFields: {
  title: "Medicamentos",
  view: "historia_clinica_medicamento",
  fields: [
    { id: "id_historia_clinica", label: "Historia clínica", hidden: true },
    { id: "id_medicamento", label: "Medicamento", type: "combobox" },
    { id: "dosis", label: "Dosis"},
    { id: "precio", label: "Precio S/", type: "number" },
    { id: "fecha", label: "Fecha", type: "datetime" },
    { id: "archivo", label: "Imagen", type: "file" },
  ],
  recordFields: [
    { id: "nombre_medicamento", label: "MEDICAMENTO" },
    { id: "dosis", label: "Dosis" },
    { id: "precio", label: "Precio S/" },
    
  ]},
  procedimientoFields: {
  title: "Procedimientos",
  view: "historia_clinica_procedimiento",
  fields: [
    { id: "id_historia_clinica", label: "Historia clínica", hidden: true },
    { id: "id_procedimiento", label: "Procedimiento", type: "combobox" },
    { id: "detalle", label: "Detalle"},
    { id: "precio", label: "Precio S/", type: "number" },
    { id: "fecha", label: "Fecha", type: "datetime" },
    { id: "archivo", label: "Imagen", type: "file" },
  ],
  recordFields: [
    { id: "nombre_procedimiento"},
    { id: "detalle", label: "Detalle" },
    { id: "precio", label: "Precio S/" },
  ]
  },
  anamnesisFields: {
  title: "Anamnesis",
  view: "historia_clinica_anamnesis",
  fields: [
    { id: "id_historia_clinica", label: "Historia clínica", hidden: true },
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
    { id: "temperatura", label: "Temperatura (°C)", type: "number" },
    { id: "frecuencia_cardiaca", label: "Frecuencia cardiaca (lpm)", type: "number" },
    { id: "frecuencia_respiratoria", label: "Frecuencia respiratoria (rpm)", type: "number" },
    { id: "tiempo_llenado_capilar", label: "Tiempo llenado capilar (seg)", type: "number" },
    { id: "peso", label: "Peso (kg)", type: "number" },
  ]}
};
export default function DatatablePage() {
  return <DataTableLayout {...{ view, title, formFields, searchFields, footerFields, extendedFields }} />;
}