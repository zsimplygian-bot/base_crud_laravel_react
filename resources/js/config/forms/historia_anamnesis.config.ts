import { Heart } from "lucide-react"
export const historia_anamnesisForm = {
  title: "Anamnesis",
  view: "historia_anamnesis",
  icon: Heart,
  fields: [
    { id: "id_historia", hidden: true },
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
}