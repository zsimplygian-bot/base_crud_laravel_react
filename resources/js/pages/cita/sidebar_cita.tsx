import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { SmartDropdown } from "@/components/smart-dropdown"
import type { SDItem } from "@/components/smart-dropdown"
import { Clock } from "lucide-react"
import { toast } from "@/components/ui/sonner"
import { NewRecordButton } from "@/components/datatable/toolbar/new-record-button"
import { ActionButtons } from "@/components/datatable/base/action-buttons"
const DAY_RULES = [
  { max: 0, type: "error", label: "hoy" },
  { max: 1, type: "warning", label: "mañana" },
  { max: 3, type: "info", label: "en pocos días" },
]
const CITA_FORM_FIELDS = {
  fields: [
    { id: "id_mascota", label: "Mascota", type: "combobox" },
    { id: "id_motivo", label: "Motivo cita", type: "combobox" },
    { id: "fecha", label: "Fecha", type: "datetime" },
    { id: "observaciones", label: "Observaciones" },
    { id: "id_estado_cita", label: "Estado cita", type: "combobox", default: "1" },
  ],
}
const getDayAlert = (days: number, cita: any) => {
  const r = DAY_RULES.find(v => days <= v.max)
  return r ? { type: r.type, label: r.label, days, cita } : null
}
const formatFecha = (v: string) => {
  if (!v) return ""
  return v.endsWith("00:00:00") ? v.slice(0, 10) : v
}
const CitaItem = memo(({ cita, onRefresh }: any) => (
  <div className="flex items-center justify-between px-2 py-2 rounded-md select-none">
    <div className="flex-1 flex flex-col">
      <div className="flex items-center gap-2 mb-1">
        <Clock className="w-4 h-4 text-blue-500" />
        <span className="font-medium text-sm truncate">{cita.mascota}</span>-
        <span className="text-xs text-muted-foreground">{cita.cliente}</span>
      </div>
      <div className="text-xs">
        {cita.motivo} - {formatFecha(cita.fecha)}
      </div>
    </div>
    <ActionButtons {...{ row_id: String(cita.id), view: "cita", title: "Cita", formFields: CITA_FORM_FIELDS, onSuccess: onRefresh, }} />
  </div>
))
export default function CitasDropdown() {
  const baseUrl = import.meta.env.VITE_APP_URL || ""
  const [citas, setCitas] = useState<any[]>([])
  const notifiedIds = useRef(new Set<number>())
  const fetchCitas = useCallback(() => {
    fetch(`${baseUrl}/api/citas/proximas`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        if (!Array.isArray(data)) return
        const today = new Date(); today.setHours(0,0,0,0)
        setCitas(
          data.map(c => {
            const d = new Date(c.fecha)
            const fd = new Date(d); fd.setHours(0,0,0,0)
            const diffDays = Math.floor((fd.getTime() - today.getTime()) / 86400000)
            return {
              ...c,
              fecha: formatFecha(c.fecha),
              _fechaDt: d,
              diffDays,
              alert: getDayAlert(diffDays, c),
            }
          }).sort((a,b) => a._fechaDt - b._fechaDt)
        )
      })
      .catch(() => toast.error("No se pudieron cargar las citas próximas"))
  }, [baseUrl])
  useEffect(() => { fetchCitas() }, [fetchCitas])
  useEffect(() => {
  [...citas].reverse().forEach(c => {
    if (!c.alert || notifiedIds.current.has(c.id)) return
    const { type, days, cita } = c.alert
    toast[type](
      <div className="flex flex-col gap-1">
        <div className="text-xs text-muted-foreground">
          {cita.mascota} — {cita.cliente}
        </div>
        <div className="text-xs">{cita.motivo}</div>
        <div className="text-xs opacity-80">
          📅 {formatFecha(cita.fecha)} ({days === 0 ? "Hoy" : `En ${days} día${days > 1 ? "s" : ""}`})
        </div>
      </div>
    )
    notifiedIds.current.add(c.id)
  })
}, [citas])
  const items: SDItem[] = useMemo(
    () =>
      citas.length
        ? citas.map(c => ({ custom: <CitaItem key={c.id} cita={c} onRefresh={fetchCitas} /> }))
        : [{ custom: <div className="text-xs text-muted-foreground px-2 py-1">Sin citas próximas</div> }],
    [citas, fetchCitas]
  )
  return (
    <SmartDropdown
      {...{
        label: "Citas próximas",
        labelExtra: (
          <NewRecordButton {...{ view: "cita", title: "Cita", formFields: CITA_FORM_FIELDS, onSuccess: fetchCitas }} />
        ),
        triggerVariant: "ghost",
        closeOnSelect: false,
        triggerIcon: Clock,
        triggerBadge: citas.length ? String(citas.length) : undefined,
        triggerBadgeClassName: "bg-red-600 text-white",
        items,
      }}
    />
  )
}