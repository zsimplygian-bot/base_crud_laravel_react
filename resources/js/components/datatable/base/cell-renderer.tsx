// components/datatable/body/cell-renderer.tsx
import React, { useCallback, memo, useEffect } from "react"
import { SmartBadge } from "@/components/smart-badge"
import { PhoneIcon } from "lucide-react"

type RenderFn = (v: any, row?: any, view?: string) => React.ReactNode

// Utils
export const $ = (obj: any, path: string) =>
  path.split(".").reduce((a, k) => a?.[k], obj)

const normalize = (v: any) =>
  String(v ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .toUpperCase()

// Configuración
const CONFIG = {
  estado_historia_clinica: {
    ACTIVO: "green",
    ATENDIDO: "green",
    ABIERTO: "green",
    REFERIDO: "yellow",
    CERRADO: "gray",
    "EN OBSERVACIÓN": "gray",
  },
  estado_cita: {
    ATENDIDO: "green",
    CANCELADO: "red",
    PENDIENTE: "gray",
  },
  estado_mascota: {
    SANO: "green",
    ENFERMO: "red",
    FALLECIDO: "gray",
    TRATAMIENTO: "yellow",
  },
  colores: {
    negro: "#000",
    negras: "#000",
    marrón: "#7B3F00",
    marron: "#7B3F00",
    acero: "#A8A9AD",
    cenizo: "#B2BEB5",
    crema: "#fff0bf",
    blanco: "#fff",
    gris: "#808080",
    plomo: "#808080",
    dorado: "#DAA520",
    rojo: "#f00",
    azul: "#00f",
    verde: "#008000",
    rosa: "#FFC0CB",
    naranja: "#FFA500",
    morado: "#800080",
    caramelo: "#FF7F50",
    beige: "#F5F5DC",
    fuego: "#FF4500",
  },
  ignoreColorWords: new Set(["con", "y", "de", "manchas", "claro", "oscuro"]),
}

// Renderers base
const BadgeStatus = memo(
  ({ value, map }: { value: any; map: Record<string, string> }) => (
    <SmartBadge color={map[normalize(value)] || "gray"}>
      {normalize(value)}
    </SmartBadge>
  )
)

const ImageCell = memo(({ src }: { src?: string }) => {
  if (!src) return "—"
  useEffect(() => {
    fetch(src, { method: "HEAD" }).catch(() => {})
  }, [src])
  return (
    <img
      src={src}
      className="h-12 w-12 object-cover rounded-md border"
      alt="Archivo"
    />
  )
})

const renderFecha = (v: any) => {
  const s = String(v ?? "")
  if (!s) return "—"
  return s.endsWith("00:00:00") ? s.replace(" 00:00:00", "") : s
}

const renderEmoji = (v: any) => (
  <span className="text-[2.5em] leading-none">{v}</span>
)

const renderTelefono = (v: any) => {
  const phone = String(v ?? "").replace(/\D/g, "")
  if (!phone) {
    return <SmartBadge color="gray">—</SmartBadge>
  }
  return (
    <SmartBadge color="green" icon={PhoneIcon}>
      <a href={`https://wa.me/51${phone}`} target="_blank">
        {v}
      </a>
    </SmartBadge>
  )
}

const renderColor = (v: any) => {
  if (!v) return "—"
  const colors = String(v)
    .toLowerCase()
    .split(/\s+/)
    .filter(w => w && !CONFIG.ignoreColorWords.has(w))
    .map(w => CONFIG.colores[w] ?? "#999")
  const bg =
    colors.length > 1
      ? `linear-gradient(to right, ${colors.join(", ")})`
      : colors[0]
  return (
    <SmartBadge
      className="size-7 rounded-full border border-gray-600 p-0"
      style={{ background: bg }}
    />
  )
}

// Edad en meses -> años + meses
const renderEdad = (v: any) => {
  const meses = parseInt(v, 10)
  if (isNaN(meses) || meses < 0) return "—"
  const años = Math.floor(meses / 12)
  const resto = meses % 12
  if (años && resto)
    return `${años} ${años === 1 ? "año" : "años"}, ${resto} ${
      resto === 1 ? "mes" : "meses"
    }`
  if (años) return `${años} ${años === 1 ? "año" : "años"}`
  return `${resto} ${resto === 1 ? "mes" : "meses"}`
}

// Estado activo / inactivo
const renderActivo = (v: any) => {
  const activo = Number(v) === 1
  return (
    <SmartBadge color={activo ? "green" : "gray"}>
      {activo ? "ACTIVO" : "INACTIVO"}
    </SmartBadge>
  )
}

// Registro de renderers
const R: Record<string, RenderFn> = {
  fecha: renderFecha,
  created_at: renderFecha,
  updated_at: renderFecha,

  telefono: renderTelefono,
  color: renderColor,

  edad: renderEdad,
  edad_actual: renderEdad,
  edad_meses: renderEdad,

  activo: renderActivo,

  estado_historia_clinica: v => (
    <BadgeStatus value={v} map={CONFIG.estado_historia_clinica} />
  ),
  estado_cita: v => (
    <BadgeStatus value={v} map={CONFIG.estado_cita} />
  ),
  estado_mascota: v => (
    <BadgeStatus value={v} map={CONFIG.estado_mascota} />
  ),

  archivo: (_, row, view) => {
    if (!row?.id || !view) return "—"
    return <ImageCell src={`/media/${view}/${row.id}/image.jpg`} />
  },
}

// Hook principal
export const useRenderCellContent = (defaultView?: string) =>
  useCallback(
    (key: string, row?: any, view?: string) => {
      const v = $(row, key)

      if (
        v == null ||
        (typeof v === "string" && v.trim() === "") ||
        (Array.isArray(v) && v.length === 0)
      ) {
        return "—"
      }

      if (key.startsWith("emoji")) return renderEmoji(v)
      if (key.toLowerCase().includes("fecha") || key.endsWith("_at"))
        return renderFecha(v)

      const renderFn = R[key]
      if (typeof renderFn === "function")
        return renderFn(v, row, view || defaultView)

      if (key.toLowerCase().includes("archivo") && view) {
        const file = Array.isArray(v)
          ? v.find(f => f)?.trim()
          : String(v).trim()
        return <ImageCell src={`/images/${view}/${file}`} />
      }

      return v
    },
    [defaultView]
  )

export const registerRenderer = (key: string, fn: RenderFn) => {
  if (typeof fn === "function") R[key] = fn
}
