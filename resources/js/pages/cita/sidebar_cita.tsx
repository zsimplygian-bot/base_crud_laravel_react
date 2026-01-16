// pages/cita/sidebar-cita.tsx
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { SmartDropdown } from "@/components/smart-dropdown"
import type { SDItem } from "@/components/smart-dropdown"
import { Clock } from "lucide-react"
import { router } from "@inertiajs/react"
import { toast } from "sonner"
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
    { id: "id_motivo_cita", label: "Motivo cita", type: "combobox" },
    { id: "fecha", label: "Fecha", type: "date" },
    { id: "hora", label: "Hora", type: "time" },
    { id: "observaciones", label: "Observaciones" },
    { id: "id_estado_cita", label: "Estado cita", type: "combobox", default: "1" },
  ],
}
const getDayAlert = (d, c) => {
  const r = DAY_RULES.find(r => d <= r.max)
  return r ? { type: r.type, msg: `Cita con ${c.mascota} (${c.cliente}) es ${r.label}` } : null
}
const CitaItem = memo(function CitaItem({ cita, baseUrl, onRefresh }) {
  const handleAtender = useCallback(() => {
    router.post(`${baseUrl}/cita/atender/${cita.id}`, {}, {
      onSuccess: onRefresh, // Refetch al atender
    })
  }, [baseUrl, cita.id, onRefresh])
  return (
    <div className="flex items-center justify-between px-2 py-2 rounded-md select-none">
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="w-4 h-4 text-blue-500" />
          <span className="font-medium text-sm truncate">{cita.mascota}</span>
          <span className="text-xs text-muted-foreground">— {cita.cliente}</span>
        </div>
        <div className="text-xs">
          {cita.motivo_cita} — {cita.displayDate}
        </div>
      </div>
      <ActionButtons
        {...{
          row_id: String(cita.id),
          view: "cita",
          title: "Cita",
          formFields: CITA_FORM_FIELDS,
          onSuccess: onRefresh, // Refetch al editar / eliminar
        }}
      />
    </div>
  )
})
export default function CitasDropdown() {
  const baseUrl = import.meta.env.VITE_APP_URL || ""
  const [citas, setCitas] = useState<any[]>([])
  const notified = useRef(new Set<number>())
  const fetchCitas = useCallback(() => {
    fetch(`${baseUrl}/api/citas/proximas`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        if (!Array.isArray(data)) return
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        setCitas(
          data.map(c => {
            const [y, m, d] = c.fecha.split("-").map(Number)
            const fecha = new Date(y, m - 1, d)
            const diffDays = Math.floor((fecha.getTime() - today.getTime()) / 86400000)
            return {
              ...c,
              diffDays,
              alert: getDayAlert(diffDays, c),
              displayDate: `${c.fecha} ${c.hora.slice(0, 5)}`,
            }
          })
        )
      })
      .catch(() => {})
  }, [baseUrl])
  useEffect(() => {
    fetchCitas()
  }, [fetchCitas])
  useEffect(() => {
    for (const c of citas) {
      if (c.alert && !notified.current.has(c.id)) {
        toast[c.alert.type](c.alert.msg)
        notified.current.add(c.id)
      }
    }
  }, [citas])
  const items: SDItem[] = useMemo(
    () =>
      citas.length
        ? citas.map(c => ({
            custom: (
              <CitaItem
                key={c.id}
                cita={c}
                baseUrl={baseUrl}
                onRefresh={fetchCitas}
              />
            ),
          }))
        : [
            {
              custom: (
                <div className="text-xs text-muted-foreground px-2 py-1">
                  Sin citas próximas
                </div>
              ),
            },
          ],
    [citas, baseUrl, fetchCitas]
  )
  return (
    <SmartDropdown
  {...{
    label: "Citas próximas",
    labelExtra: (
      <NewRecordButton
        {...{
          view: "cita",
          title: "Cita",
          formFields: CITA_FORM_FIELDS,
          onSuccess: fetchCitas,
        }}
      />
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