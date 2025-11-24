import React from "react";
import { PhoneIcon, Mars, Venus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const cls = (...c: any[]) => c.filter(Boolean).join(" ");
const normalize = (v: any) =>
  String(v || "").trim().replace(/\s+/g, " ").toUpperCase();

export const $ = (obj: any, path: string) =>
  path.split(".").reduce((a, k) => a?.[k], obj);

const fmt = (v: any, prefix = "", suffix = "", prec = 1) =>
  v != null ? `${prefix}${Number(v).toFixed(prec)}${suffix}` : "—";

// DATA CONFIG
const CONFIG = {
  estados: {
    ACTIVO: "green",
    ATENDIDO: "green",
    ABIERTO: "green",
    REFERIDO: "yellow",
    CERRADO: "gray",
    "EN OBSERVACIÓN": "gray",
  },
  estado_mascota: {
    SANO: "green",
    ENFERMO: "red",
    FALLECIDO: "gray",
    TRATAMIENTO: "yellow",
  },
  especies: { canino: "🐶", felino: "🐱", conejo: "🐰", ave: "🐦" },
  colores: {
    negro: "#000", negras: "#000", marrón: "#7B3F00", marron: "#7B3F00",
    acero: "#A8A9AD", cenizo: "#B2BEB5", crema: "#fff0bf", blanco: "#fff",
    gris: "#808080", plomo: "#808080", dorado: "#DAA520", rojo: "#f00",
    azul: "#00f", verde: "#008000", rosa: "#FFC0CB", naranja: "#FFA500",
    morado: "#800080", caramelo: "#FF7F50", beige: "#F5F5DC", fuego: "#FF4500",
  },
  ignoreColorWords: new Set(["con", "y", "de", "manchas", "claro", "oscuro"]),
};

// MAPEO DE CLASES TAILWIND PARA BADGES
const COLOR_CLASSES: Record<string, string> = {
  green: "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100",
  yellow: "bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100",
  gray: "bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100",
  red: "bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100",
};

// RENDER HELPERS
const renderEdad = (v: any) => {
  const m = parseInt(v, 10);
  if (isNaN(m) || m < 0) return "—";
  const y = Math.floor(m / 12);
  const mo = m % 12;
  if (!y) return `${mo} ${mo === 1 ? "mes" : "meses"}`;
  if (!mo) return `${y} ${y === 1 ? "año" : "años"}`;
  return `${y} ${y === 1 ? "año" : "años"}, ${mo} ${mo === 1 ? "mes" : "meses"}`;
};

// COMPONENTES BASE
const SmartBadge = React.memo(
  ({
    color = "gray",
    children,
    className = "",
  }: {
    color?: string;
    children: React.ReactNode;
    className?: string;
  }) => {
    const clsColor = COLOR_CLASSES[color] ?? COLOR_CLASSES.gray;
    return (
      <Badge className={cls(`px-2 py-1 text-xs font-medium`, clsColor, className)}>
        {children}
      </Badge>
    );
  }
);

const BadgeStatus = React.memo(
  ({ v, map }: { v: any; map: Record<string, string> }) => {
    const key = normalize(v);
    return <SmartBadge color={map[key] || "red"}>{key}</SmartBadge>;
  }
);

const ImageDialog = React.memo(
  ({ v, view }: { v: string; view?: string }) => {
    if (!v || !view) return "—";
    const src = `/images/${view}/${v}`;
    return (
      <Dialog>
        <DialogTrigger asChild>
          <img
            src={src}
            className="size-12 object-cover rounded-md border cursor-pointer hover:opacity-80"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        </DialogTrigger>
        <DialogContent className="max-w-[100vw] max-h-[100vh] p-0">
          <img src={src} className="w-full h-full object-contain rounded-md" />
        </DialogContent>
      </Dialog>
    );
  }
);

// RENDER MAP
type RenderFn = (v: any, row?: any, view?: string) => React.ReactNode;
const R: Record<string, RenderFn> = {
  valor: (v) => fmt(v, "S/. "),
  total: (v) => fmt(v, "S/. "),
  precio: (v) => fmt(v, "S/. "),
  peso: (v) => fmt(v, "", " kg"),
  telefono: (v) => {
    const phone = v?.replace(/\D/g, "") || "";
    const valid = phone.length > 0;
    return (
      <SmartBadge color={valid ? "green" : "gray"}>
        {valid ? (
          <a
            href={`https://wa.me/51${phone}`}
            target="_blank"
            className="flex items-center gap-2 text-sm"
          >
            <PhoneIcon className="w-4 h-4" /> {v}
          </a>
        ) : (
          <span className="flex items-center gap-2 text-sm">
            <PhoneIcon className="w-4 h-4" /> —
          </span>
        )}
      </SmartBadge>
    );
  },
  estado: (v) => <BadgeStatus v={v} map={CONFIG.estados} />,
  estado_delega: (v) => <BadgeStatus v={v} map={CONFIG.estados} />,
  estado_mascota: (v) => <BadgeStatus v={v} map={CONFIG.estado_mascota} />,
  imagen: (v, _, view) => <ImageDialog v={v} view={view} />,
  raza: (v) => {
    if (!v) return "—";
    const t = v.toLowerCase().trim();
    const key = Object.keys(CONFIG.especies).find((k) => t.startsWith(k));
    const icon = key ? CONFIG.especies[key] : "🐾";
    const clean = key ? v.replace(new RegExp(`^${key}\\s*-?\\s*`, "i"), "") : v;
    return (
      <span className="flex items-center gap-2">
        <span className="text-xl">{icon}</span> {clean}
      </span>
    );
  },
  sexo: (v) => {
    const male = v?.toLowerCase().includes("macho");
    const Icon = male ? Mars : Venus;
    const color = male
      ? "text-blue-600 dark:text-blue-400"
      : "text-pink-600 dark:text-pink-400";
    return <span className={cls("flex items-center gap-2", color)}><Icon /></span>;
  },
  color: (v) => {
    if (!v) return "—";
    const colors = v
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w && !CONFIG.ignoreColorWords.has(w))
      .map((w) => CONFIG.colores[w] ?? "#999");
    const bg =
      colors.length > 1
        ? `linear-gradient(to right, ${colors.join(", ")})`
        : colors[0];
    return (
      <Badge
        className="size-7 rounded-full border border-gray-600 p-0"
        style={{ background: bg }}
      />
    );
  },
  stock: (v, r) => {
    const s = Number(v ?? 0);
    const min = Number(r?.stock_min ?? 0);
    const max = Number(r?.stock_max ?? Infinity);
    const color = s <= min ? "red" : s >= max ? "yellow" : "green";
    return <SmartBadge color={color}>{s}</SmartBadge>;
  },
  edad: renderEdad,
  edad_actual: renderEdad,
};

// HOOK
export const useRenderCellContent = () =>
  React.useCallback((key, row, view) => {
    const v = $(row, key);
    if (v == null || v === "") return "—";
    if (R[key]) return R[key](v, row, view);
    if (key.toLowerCase().includes("imagen") && view) return <ImageDialog v={v} view={view} />;
    return v;
  }, []);

// Registro externo
export const registerRenderer = (key: string, fn: RenderFn) => {
  R[key] = fn;
};
