import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
import axios from "axios"
import { SmartDropdown } from "@/components/smart-dropdown"
import { Clock, Check, X } from "lucide-react"
import { toast } from "@/components/ui/sonner"
import { NewRecordButton } from "@/components/datatable/toolbar/new-record-button"
import { ActionButtons } from "@/components/datatable/base/action-buttons"
import { SmartButton } from "@/components/smart-button"
const DAY_RULES = [
  { max: 0, type: "error" },
  { max: 1, type: "warning" },
  { max: 3, type: "info" },
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
const formatFecha = (v?: string) =>
  v?.endsWith("00:00:00") ? v.slice(0, 10) : v ?? ""
const getAlert = (days: number, cita: any) => {
  const rule = DAY_RULES.find(r => days <= r.max)
  return rule ? { ...rule, days, cita } : null
}
const CitaItem = memo(({ cita, onRefresh }: any) => {
  const post = useCallback(
    async (path: string, msg: string) => {
      try {
        await axios.post(path)
        toast.success(msg)
        onRefresh()
      } catch {
        toast.error("Operación no completada")
      }
    },
    [onRefresh]
  )
  return (
    <div
      className="flex items-center justify-between gap-2 px-2 py-2 select-none"
      onClick={e => e.stopPropagation()} // Evita cerrar dropdown
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Clock className="w-4 h-4 text-blue-500" />
          <span className="truncate">{cita.mascota}</span>
          <span className="text-xs text-muted-foreground">- {cita.cliente}</span>
        </div>
        <div className="text-xs">
          {cita.motivo} - {formatFecha(cita.fecha)}
        </div>
      </div>
      <div className="flex items-center gap-1">
        <SmartButton {...{ icon: Check, tooltip: "Atender", variant: "secondary",
          onClick: () => post(`/api/cita/${cita.id}/atender`, "Cita atendida"), }} />
        <SmartButton {...{ icon: X, tooltip: "Cancelar", variant: "destructive",
          onClick: () => post(`/api/cita/${cita.id}/cancelar`, "Cita cancelada"), }} />
        <ActionButtons {...{ row_id: String(cita.id), view: "cita", title: "Cita",
          formFields: CITA_FORM_FIELDS, onSuccess: onRefresh, }} />
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
      setCitas(
        (r.data ?? [])
          .map((c: any) => {
            const dt = new Date(c.fecha)
            const day = new Date(dt); day.setHours(0,0,0,0)
            const diff = Math.floor((day.getTime() - today.getTime()) / 86400000)
            return {
              ...c,
              fecha: formatFecha(c.fecha),
              _dt: dt,
              alert: getAlert(diff, c),
            }
          })
          .sort((a: any, b: any) => a._dt - b._dt)
      )
    }).catch(() => toast.error("No se pudieron cargar las citas"))
  }, [])
  useEffect(fetchCitas, [fetchCitas])
  useEffect(() => {
    for (const c of [...citas].reverse()) {
      if (!c.alert || notified.current.has(c.id)) continue
      const { type, days, cita } = c.alert
      toast[type](
        <div className="text-xs space-y-1">
          <div className="text-muted-foreground">
            {cita.mascota} — {cita.cliente}
          </div>
          <div>{cita.motivo}</div>
          <div className="opacity-80">
            📅 {formatFecha(cita.fecha)} ({days === 0 ? "Hoy" : `En ${days} día${days > 1 ? "s" : ""}`})
          </div>
        </div>
      )
      notified.current.add(c.id)
    }
  }, [citas])
  const items = useMemo(
    () =>
      citas.length
        ? citas.map(c => ({
            custom: <CitaItem key={c.id} {...{ cita: c, onRefresh: fetchCitas }} />,
          }))
        : [{ custom: <div className="px-2 py-1 text-xs text-muted-foreground">Sin citas próximas</div> }],
    [citas, fetchCitas]
  )
  return (
    <SmartDropdown {...{
      label: "Citas próximas",
      labelExtra: (
        <NewRecordButton {...{ view: "cita", title: "Cita", formFields: CITA_FORM_FIELDS,
          onSuccess: fetchCitas, buttonClassName: "h-7 w-7 p-0",
        }} />
      ),
      triggerIcon: Clock,
      triggerVariant: "ghost",
      triggerBadge: citas.length,
      triggerBadgeClassName: "bg-red-600 text-white",
      closeOnSelect: false,
      itemsMaxHeight: 320,
      items,
    }} />
  )
}