import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
import axios from "axios"
import { SmartDropdown } from "@/components/smart-dropdown"
import { Bell, Check, X } from "lucide-react"
import { toast } from "@/components/ui/sonner"
import { NewRecordButton } from "@/components/datatable/toolbar/new-record-button"
import { ActionButtons } from "@/components/datatable/base/action-buttons"
import { SmartButton } from "@/components/smart-button"
import { FORM_CONFIG } from "@/config/forms"
const DAY_RULES = [
  { max: 0, type: "error" },
  { max: 1, type: "warning" },
  { max: 3, type: "info" },
]
const formatFecha = (v?: string) => v?.endsWith("00:00:00") ? v.slice(0, 10) : v ?? ""
const getAlert = (d: number, c: any) => {
  const r = DAY_RULES.find(x => d <= x.max)
  return r ? { ...r, days: d, cita: c } : null
}
const CitaItem = memo(({ cita, onRefresh }: any) => {
  const post = useCallback(async (url: string, msg: string) => {
    try { await axios.post(url); toast.success(msg); onRefresh() }
    catch { toast.error("Operación no completada") }
  }, [onRefresh])
  return (
    <div className="flex items-center justify-between gap-2 px-2 py-2 select-none"
      onClick={e => e.stopPropagation()} // Evita cerrar dropdown
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Bell className="w-4 h-4 text-blue-500" />
          <span className="truncate">{cita.mascota}</span>
          <span className="text-xs text-muted-foreground">- {cita.cliente}</span>
        </div>
        <div className="text-xs">{cita.motivo} - {formatFecha(cita.fecha)}</div>
      </div>
      <div className="flex items-center gap-1">
        <SmartButton {...{ icon: Check, tooltip: "Atender", variant: "secondary",
          onClick: () => post(`/api/cita/${cita.id}/atender`, "Cita atendida") }} />
        <SmartButton {...{ icon: X, tooltip: "Cancelar", variant: "destructive",
          onClick: () => post(`/api/cita/${cita.id}/cancelar`, "Cita cancelada") }} />
        <ActionButtons {...{ row_id: cita.id,
          view: FORM_CONFIG.cita.view, title: FORM_CONFIG.cita.title, fields: FORM_CONFIG.cita.fields,
          onSuccess: onRefresh, }} />
      </div>
    </div>
  )
})
export default function CitasDropdown() {
  const [citas, setCitas] = useState<any[]>([])
  const notified = useRef(new Set<number>())
  const fetchCitas = useCallback(() => {
    axios.get("/api/citas/proximas").then(r => {
      const today = new Date(); today.setHours(0,0,0,0)
      setCitas((r.data ?? []).map((c: any) => {
        const dt = new Date(c.fecha); dt.setHours(0,0,0,0)
        const diff = Math.floor((dt.getTime() - today.getTime()) / 86400000)
        return { ...c, fecha: formatFecha(c.fecha), _dt: new Date(c.fecha), alert: getAlert(diff, c) }
      }).sort((a: any, b: any) => a._dt - b._dt))
    }).catch(() => toast.error("No se pudieron cargar las citas"))
  }, [])
  useEffect(fetchCitas, [fetchCitas])
  useEffect(() => {
    citas.slice().reverse().forEach(c => {
      if (!c.alert || notified.current.has(c.id)) return
      const { type, days, cita } = c.alert
      toast[type](
        <div className="text-xs space-y-1">
          <div className="text-muted-foreground">{cita.mascota} — {cita.cliente}</div>
          <div>{cita.motivo}</div>
          <div className="opacity-80">
            📅 {formatFecha(cita.fecha)} ({days === 0 ? "Hoy" : `En ${days} día${days > 1 ? "s" : ""}`})
          </div>
        </div>
      )
      notified.current.add(c.id)
    })
  }, [citas])
  const items = useMemo(() =>
    citas.length
      ? citas.map(c => ({ custom: <CitaItem key={c.id} {...{ cita: c, onRefresh: fetchCitas }} /> }))
      : [{ custom: <div className="px-2 py-1 text-xs text-muted-foreground">Sin citas próximas</div> }],
    [citas, fetchCitas]
  )
  return (
    <SmartDropdown {...{ label: "Citas próximas",
      labelExtra: (
        <NewRecordButton {...{  view: FORM_CONFIG.cita.view, title: FORM_CONFIG.cita.title, fields: FORM_CONFIG.cita.fields,
          onSuccess: fetchCitas, buttonClassName: "h-7 w-7 p-0", }} />
      ),
      triggerIcon: Bell, triggerVariant: "ghost", triggerBadge: citas.length,
      triggerBadgeClassName: "bg-red-600 text-white", closeOnSelect: false,
      itemsMaxHeight: 320, items, }} />
  )
}