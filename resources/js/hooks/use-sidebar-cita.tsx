// hooks/useCitas.ts
import { useEffect, useMemo, useRef } from "react"
import { toast } from "sonner"
import { useApi } from "@/hooks/use-api"
const DAY_RULES = [
  { max: 0, type: "error", label: "hoy" },
  { max: 1, type: "warning", label: "mañana" },
  { max: 3, type: "info", label: "en pocos días" },
]
const getDayAlert = (d, c) => {
  const r = DAY_RULES.find(r => d <= r.max)
  return r ? { type: r.type, msg: `Cita con ${c.mascota} (${c.cliente}) es ${r.label}` } : null
}
export function useCitas(baseUrl: string) {
  const { data: citasApi } = useApi(`${baseUrl}/api/citas/proximas`, {
    autoFetch: true,
    method: "GET",
    initialData: [],
  })
  const notified = useRef(new Set())
  const citas = useMemo(() => {
    if (!Array.isArray(citasApi) || citasApi.length === 0) return []
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return citasApi.map(c => {
      const [y, m, d] = c.fecha.split("-").map(Number)
      const fecha = new Date(y, m - 1, d)
      const diffDays = Math.floor((fecha - today) / 86400000)
      return {
        ...c,
        diffDays,
        alert: getDayAlert(diffDays, c),
        displayDate: `${c.fecha} ${c.hora.slice(0, 5)}`,
      }
    })
  }, [citasApi])
  useEffect(() => {
    for (const c of citas) {
      if (c.alert && !notified.current.has(c.id)) {
        toast[c.alert.type](c.alert.msg)
        notified.current.add(c.id)
      }
    }
  }, [citas])
  return citas
}