// components/datatable/body/cell-renderer.tsx
import React, { useCallback, memo, useEffect } from "react";
import { SmartBadge } from "@/components/smart-badge";
import { PhoneIcon, Mars, Venus } from "lucide-react";

const cls = (...classes: any[]) => classes.filter(Boolean).join(" ");
const normalize = (v: any) => String(v || "").trim().replace(/\s+/g, " ").toUpperCase();
export const $ = (obj: any, path: string) => path.split(".").reduce((a, k) => a?.[k], obj);
const fmt = (v: any, prefix = "", suffix = "", prec = 1) =>
  v != null ? `${prefix}${Number(v).toFixed(prec)}${suffix}` : "—";

const CONFIG = {
  estado_historia_clinica: { ACTIVO: "green", ATENDIDO: "green", ABIERTO: "green", REFERIDO: "yellow", CERRADO: "gray", "EN OBSERVACIÓN": "gray" },
  estado_cita: { ATENDIDO: "green", CANCELADO: "red", PENDIENTE: "gray" },
  estado_mascota: { SANO: "green", ENFERMO: "red", FALLECIDO: "gray", TRATAMIENTO: "yellow" },
  colores: {
    negro: "#000", negras: "#000", marrón: "#7B3F00", marron: "#7B3F00",
    acero: "#A8A9AD", cenizo: "#B2BEB5", crema: "#fff0bf", blanco: "#fff",
    gris: "#808080", plomo: "#808080", dorado: "#DAA520", rojo: "#f00",
    azul: "#00f", verde: "#008000", rosa: "#FFC0CB", naranja: "#FFA500",
    morado: "#800080", caramelo: "#FF7F50", beige: "#F5F5DC", fuego: "#FF4500"
  },
  ignoreColorWords: new Set(["con", "y", "de", "manchas", "claro", "oscuro"]),
};

// COMPONENTES BASE
const BadgeStatus = memo(({ value, map }: { value: any; map: Record<string, string> }) => (
  <SmartBadge color={map[normalize(value)] || "red"}>{normalize(value)}</SmartBadge>
));

const ImageCell = memo(({ src }: { src?: string }) => {
  if (!src) return "—";
  useEffect(() => {
    fetch(src, { method: "HEAD" }).catch(() => {});
  }, [src]);
  return <img src={src} className="h-12 w-12 object-cover rounded-md border" alt="Archivo" />;
});

// RENDER HELPERS
const renderEdad = (v: any) => {
  const m = parseInt(v, 10);
  if (isNaN(m) || m < 0) return "—";
  const y = Math.floor(m / 12), mo = m % 12;
  return y
    ? mo ? `${y} ${y === 1 ? "año" : "años"}, ${mo} ${mo === 1 ? "mes" : "meses"}` : `${y} ${y === 1 ? "año" : "años"}`
    : `${mo} ${mo === 1 ? "mes" : "meses"}`;
};

const renderTelefono = (v: any) => {
  const phone = String(v || "").replace(/\D/g, "");
  const valid = phone.length > 0;
  return (
    <SmartBadge color={valid ? "green" : "gray"} icon={PhoneIcon}>
      {valid ? <a href={`https://wa.me/51${phone}`} target="_blank">{v}</a> : "—"}
    </SmartBadge>
  );
};

const renderRaza = (v: any) => {
  if (!v) return "—";
  return <span>{v}</span>; // Texto plano
};

const renderSexo = (v: any) => {
  const male = String(v || "").toLowerCase().includes("macho");
  const Icon = male ? Mars : Venus;
  const color = male ? "text-blue-600 dark:text-blue-400" : "text-pink-600 dark:text-pink-400";
  return <span className={cls("flex items-center gap-2", color)}><Icon /></span>;
};

const renderColor = (v: any) => {
  if (!v) return "—";
  const colors = String(v).toLowerCase().split(/\s+/).filter(w => w && !CONFIG.ignoreColorWords.has(w))
    .map(w => CONFIG.colores[w] ?? "#999");
  const bg = colors.length > 1 ? `linear-gradient(to right, ${colors.join(", ")})` : colors[0];
  return <SmartBadge className="size-7 rounded-full border border-gray-600 p-0" style={{ background: bg }} />;
};

// RENDER EMOJI
const renderEmoji = (v: any) => (
  <span className="text-[2.5em] leading-none">{v}</span> // Emoji grande
);

// RENDER MAP
type RenderFn = (v: any, row?: any, view?: string) => React.ReactNode;

const R: Record<string, RenderFn> = {
  valor: v => fmt(v, "S/. "),
  total: v => fmt(v, "S/. "),
  precio: v => fmt(v, "S/. "),
  peso: v => fmt(v, "", " kg"),
  telefono: renderTelefono,
  estado_historia_clinica: v => <BadgeStatus value={v} map={CONFIG.estado_historia_clinica} />,
  estado_cita: v => <BadgeStatus value={v} map={CONFIG.estado_cita} />,
  estado_mascota: v => <BadgeStatus value={v} map={CONFIG.estado_mascota} />,
  archivo: (_, row, view) => {
    if (!row?.id || !view) return "—";
    const path = `/media/${view}/${row.id}/image.jpg`;
    return <ImageCell src={path} />;
  },
  raza: renderRaza,
  sexo: renderSexo,
  color: renderColor,
  edad: renderEdad,
  edad_actual: renderEdad,
};
// HOOK DE RENDER CELDA
export const useRenderCellContent = (defaultView?: string) => {
  return useCallback((key: string, row?: any, view?: string) => {
    const v = $(row, key);
    if (v == null || (typeof v === "string" && v.trim() === "") || (Array.isArray(v) && v.length === 0)) return "—";
    if (key.startsWith("emoji")) return renderEmoji(v); // Prefijo emoji*
    const renderFn = R[key];
    if (typeof renderFn === "function") return renderFn(v, row, view || defaultView);
    if (key.toLowerCase().includes("archivo") && view) {
      const file = Array.isArray(v) ? v.find(f => f)?.trim() : String(v).trim();
      const path = `/images/${view}/${file}`;
      return <ImageCell src={path} />;
    }
    return v;
  }, [defaultView]);
};
// REGISTRAR RENDERER EXTERNO
export const registerRenderer = (key: string, fn: RenderFn) => {
  if (typeof fn === "function") R[key] = fn;
};