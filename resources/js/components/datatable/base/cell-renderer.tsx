import React, { useCallback, memo, useMemo } from "react"
import { SmartBadge } from "@/components/smart-badge"
import { SmartButton } from "@/components/smart-button"
import { PhoneIcon, MapPin } from "lucide-react"
import { PhotoPreview } from "@/components/photo-preview"
import { cn } from "@/lib/utils"

type RenderFn = (v: any, row?: any, view?: string) => React.ReactNode

const EMOJI_REGEX = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g
const EMOJI_FONT = '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Segoe UI Symbol", sans-serif'
const VARIATION_SELECTOR = "\uFE0F"

const MAPS = {
  estados: {
    success: new Set(["ACTIVO", "ATENDIDO", "ABIERTO", "SANO"]),
    warning: new Set(["REFERIDO", "TRATAMIENTO", "EN RIESGO"]),
    error: new Set(["CANCELADO", "ENFERMO", "AUSENTE", "INACTIVO"]),
  },
  colores: {
    negro: "#000", marrón: "#7B3F00", acero: "#A8A9AD", cenizo: "#B2BEB5", 
    crema: "#fff0bf", blanco: "#fff", gris: "#808080", dorado: "#DAA520", 
    rojo: "#f00", azul: "#00f", verde: "#008000", rosa: "#FFC0CB",
    naranja: "#FFA500", morado: "#800080", beige: "#F5F5DC", fuego: "#FF4500"
  } as Record<string, string>,
  ignoreWords: new Set(["con", "y", "de", "manchas", "claro", "oscuro"])
}

export const $ = (obj: any, path: string) => path.split(".").reduce((a, k) => a?.[k], obj)
const normalize = (v: any) => String(v ?? "").trim().replace(/\s+/g, " ").toUpperCase()

// --- RENDERER DE EMOJIS SIN ESPACIADO EXTRA ---
const EmojiTextRenderer = memo(({ value }: { value: string }) => {
  const parts = useMemo(() => value.split(EMOJI_REGEX).filter(Boolean), [value])

  return (
    <div className="flex items-center gap-2 h-6 leading-none overflow-visible">
      {parts.map((part, i) => {
        const isEmoji = new RegExp(EMOJI_REGEX, "").test(part)
        
        if (isEmoji) {
          return (
            <div key={i} className="relative w-8 h-6 flex-shrink-0">
              <span 
                className="absolute inset-0 flex items-center justify-center text-[2rem] pointer-events-none select-none"
                style={{ 
                  fontFamily: EMOJI_FONT,
                  lineHeight: 1, // Forzado para evitar el pixel de base
                  top: '-2px'   // Ajuste fino manual si el emoji se ve muy alto
                }}
              >
                {part.includes(VARIATION_SELECTOR) ? part : `${part}${VARIATION_SELECTOR}`}
              </span>
            </div>
          )
        }

        return (
          <span key={i} className="text-sm font-medium whitespace-nowrap self-center">
            {part}
          </span>
        )
      })}
    </div>
  )
})

const ColorCircle = memo(({ v }: { v: any }) => {
  const background = useMemo(() => {
    if (!v) return null
    const words = String(v).toLowerCase().split(/\s+/).filter(w => w && !MAPS.ignoreWords.has(w))
    const colors = words.map(w => MAPS.colores[w] ?? "#999")
    return colors.length > 1 ? `linear-gradient(to right, ${colors.join(", ")})` : colors[0]
  }, [v])

  if (!background) return "—"

  return (
    <div 
      className="size-7 rounded-full shadow-sm mx-auto transition-transform hover:scale-110 border border-black/20 dark:border-white/40" 
      style={{ background }} 
      title={String(v)}
    />
  )
})

const BadgeStatus = memo(({ value }: { value: any }) => {
  const val = useMemo(() => normalize(value), [value])
  const color = useMemo(() => 
    MAPS.estados.success.has(val) ? "green" :
    MAPS.estados.warning.has(val) ? "yellow" :
    MAPS.estados.error.has(val) ? "red" : "gray", [val])
  
  return <SmartBadge color={color}>{val}</SmartBadge>
})

const R: Record<string, RenderFn> = {
  id: (v) => <span className="font-bold text-[13px] opacity-50">{v}</span>,
  fecha: (v) => String(v ?? "").split(" ")[0] || "—",
  telefono: (v) => {
    const phone = String(v ?? "").replace(/\D/g, "")
    return phone ? (
      <SmartBadge color="green" icon={PhoneIcon}>
        <a href={`https://wa.me/51${phone}`} target="_blank" rel="noreferrer">{v}</a>
      </SmartBadge>
    ) : "—"
  },
  edad: (v) => {
    const m = parseInt(v, 10)
    if (isNaN(m) || m < 0) return "—"
    const a = Math.floor(m / 12), r = m % 12
    return [a && `${a} ${a === 1 ? "año" : "años"}`, (r || !a) && `${r} ${r === 1 ? "mes" : "meses"}`]
      .filter(Boolean).join(", ")
  },
  ubicacion: (v) => v ? <SmartButton tooltip="Abrir Mapa" icons={[MapPin]} size="sm" onClick={() => window.open(v, "_blank")} /> : "—",
  archivo: (_, row) => row?.archivo ? <PhotoPreview filePath={row.archivo} size={40} /> : "—"
}

R.created_at = R.updated_at = R.fecha
R.edad_actual = R.edad_meses = R.edad

export const useRenderCellContent = (defaultView?: string) => {
  return useCallback(
    (key: string, row?: any, view?: string) => {
      const v = $(row, key)
      if (v == null || v === "" || (Array.isArray(v) && v.length === 0)) return "—"

      if (key === "id") return R.id(v)
      if (key === "estado_mascota" && v == 1) return <BadgeStatus value="ACTIVO" />
      
      if (key === "motivo" || key.startsWith("emoji") || key.includes("icono")) {
        return <EmojiTextRenderer value={String(v)} />
      }

      if (key.startsWith("estado_")) return <BadgeStatus value={v} />
      if (key.includes("color")) return <ColorCircle v={v} />
      
      const renderer = R[key]
      if (renderer) return renderer(v, row, view || defaultView)

      if (key.toLowerCase().includes("fecha") || key.endsWith("_at")) return R.fecha(v)
      
      if (key.toLowerCase().includes("archivo") && view) {
        return <img src={`/images/${view}/${Array.isArray(v) ? v[0] : v}`} className="size-10 object-cover rounded shadow-inner" alt="preview" />
      }

      return v
    },
    [defaultView]
  )
}