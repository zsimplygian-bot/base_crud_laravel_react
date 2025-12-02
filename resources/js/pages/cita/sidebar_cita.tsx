// pages/cita/sidebar-cita.tsx
import { useMemo, memo, useCallback } from "react"
import { SmartDropdown } from "@/components/smart-dropdown"
import type { SDItem } from "@/components/smart-dropdown"
import { Clock, Edit2, CheckCircle } from "lucide-react"
import { router } from "@inertiajs/react"
import { SmartButton } from "@/components/smart-button"
import { useCitas } from "@/hooks/use-sidebar-cita"
const CitaItem = memo(function CitaItem({ cita, baseUrl }) {
  const handleAtender = useCallback(() => {
    router.post(`${baseUrl}/cita/atender/${cita.id}`)
  }, [baseUrl, cita.id])
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
      <div className="flex items-center gap-1 ml-2">
        <SmartButton
          to={`${baseUrl}/cita/form/update/${cita.id}`} icon={Edit2} variant="ghost" tooltip="Editar" className="text-green-600"
        />
        <SmartButton 
          icon={CheckCircle} tooltip="Atender" variant="ghost" onClick={handleAtender} className="text-blue-600"
        />
      </div>
    </div>
  )
})
export default function CitasDropdown() {
  const baseUrl = import.meta.env.VITE_APP_URL || ""
  const citas = useCitas(baseUrl)
  const items: SDItem[] = useMemo(() => {
    if (citas.length === 0) {
      return [
        {
          custom: (
            <div className="text-xs text-muted-foreground px-2 py-1">
              Sin citas próximas
            </div>
          ),
        },
      ]
    }
    return citas.map(c => ({
      custom: <CitaItem key={c.id} cita={c} baseUrl={baseUrl} />,
    }))
  }, [citas, baseUrl])
  return (
    <SmartDropdown
      label="Citas próximas"
      triggerVariant="ghost"
      closeOnSelect={false}
      triggerIcon={Clock}
      triggerBadge={citas.length ? String(citas.length) : undefined}
      triggerBadgeClassName="bg-red-600 text-white"
      items={items}
    />
  )
}