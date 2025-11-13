import React from "react";
import { PhoneIcon, Mars, Venus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
// CONFIGURACIÓN CENTRALIZADA (ESCALABLE)
const CONFIG = {
  estados: {
    ACTIVO: "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100",
    ATENDIDO: "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100",
    ABIERTO: "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100",
    REFERIDO: "bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100",
    CERRADO: "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    "EN OBSERVACIÓN": "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  } as const,
  especies: { canino: "🐶", felino: "🐱", conejo: "🐰", ave: "🐦" },
  colores: {
    negro: "#000", negras: "#000", marrón: "#7B3F00", marron: "#7B3F00",
    acero: "#A8A9AD", cenizo: "#B2BEB5", crema: "#fff0bf", blanco: "#fff",
    gris: "#808080", plomo: "#808080", dorado: "#DAA520", rojo: "#f00",
    azul: "#00f", verde: "#008000", rosa: "#FFC0CB", naranja: "#FFA500",
    morado: "#800080", caramelo: "#FF7F50", beige: "#F5F5DC", fuego: "#FF4500",
  } as const,
  ignoreColorWords: new Set(["con", "y", "de", "manchas", "claro", "oscuro"]),
} as const;
// UTILIDADES PURAS
export const $ = (obj: any, path: string): any =>
  path.split(".").reduce((a, k) => a?.[k], obj);
const fmt = (v: any, prefix = "", suffix = "", prec = 1) =>
  v != null ? `${prefix}${Number(v).toFixed(prec)}${suffix}` : "—";
const plural = (n: number, singular: string, plural: string) =>
  `${n} ${n === 1 ? singular : plural}`;
// COMPONENTES REUTILIZABLES (MEMOIZADOS)
const BadgeStatus = React.memo(({ v, map }: { v: any; map: typeof CONFIG.estados }) => {
  const key = String(v || "").toUpperCase();
  const color = map[key as keyof typeof map] || "bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100";
  return <Badge className={`px-2 py-1 text-xs font-medium ${color}`}>{key || "—"}</Badge>;
});
const ImageDialog = React.memo(({ v, view }: { v: any; view?: string }) => {
  if (!v || !view) return "—";
  const src = `/images/${view}/${v}`;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <img
          src={src}
          alt=""
          className="size-12 object-cover rounded-md border cursor-pointer hover:opacity-80 transition-opacity"
          onError={e => (e.currentTarget.style.display = "none")}
        />
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
        <img src={src} alt="" className="w-full h-full object-contain rounded-md" />
      </DialogContent>
    </Dialog>
  );
});
// REGISTRO DE RENDERERS (ESCALABLE)
type RenderFn = (v: any, row?: any, view?: string) => React.ReactNode;
const R: Record<string, RenderFn> = {
  // — Teléfono
  telefono: (v: any) => {
    const phone = v?.replace(/\D/g, "") || "";
    const valid = phone.length > 0;
    return (
      <Badge
        variant="outline"
        className={valid
          ? "border-green-600 text-green-600 dark:border-green-400 dark:text-green-400 hover:bg-green-600/10"
          : "border-gray-300 text-gray-500 dark:border-gray-600 dark:text-gray-300 cursor-not-allowed"}
      >
        {valid ? (
          <a href={`https://wa.me/51${phone}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm">
            <PhoneIcon className="w-4 h-4" /> {v}
          </a>
        ) : (
          <span className="flex items-center gap-2 text-sm"><PhoneIcon className="w-4 h-4" /> —</span>
        )}
      </Badge>
    );
  },
  // — Moneda
  valor: v => fmt(v, "S/. "),
  total: v => fmt(v, "S/. "),
  precio: v => fmt(v, "S/. "),
  peso: v => fmt(v, "", " kg"),
  // — Estado
  estado: v => <BadgeStatus v={v} map={CONFIG.estados} />,
  estado_delega: v => <BadgeStatus v={v} map={CONFIG.estados} />,
  // — Imagen
  imagen: (v, _, view) => <ImageDialog v={v} view={view} />,
  // — Raza
  raza: (v: any) => {
    if (!v) return "—";
    const t = String(v).toLowerCase().trim();
    const key = Object.keys(CONFIG.especies).find(k => t.startsWith(k)) || "";
    const icon = key ? CONFIG.especies[key as keyof typeof CONFIG.especies] : "paw";
    const clean = key ? v.replace(new RegExp(`^${key}\\s*-\\s*`, "i"), "").trim() : v;
    return <span className="flex items-center gap-2"><span className="text-xl">{icon}</span>{clean}</span>;
  },
  // — Sexo
  sexo: (v: any) => {
    if (!v) return "—";
    const male = String(v).toLowerCase().includes("macho");
    const Icon = male ? Mars : Venus;
    const color = male ? "text-blue-600 dark:text-blue-400" : "text-pink-600 dark:text-pink-400";
    return <span className={`flex items-center gap-2 font-medium ${color}`}><Icon /></span>;
  },
  // — Color
  color: (v: any) => {
    if (!v) return "—";
    const colors = String(v).toLowerCase().split(/\s+/)
      .filter(w => w && !CONFIG.ignoreColorWords.has(w))
      .map(w => CONFIG.colores[w as keyof typeof CONFIG.colores] ?? "#999");
    const bg = colors.length > 1 ? `linear-gradient(to right, ${colors.join(", ")})` : colors[0];
    return <Badge className="size-7 rounded-full border border-gray-600 p-0" style={{ background: bg }} />;
  },
  // — Stock
  stock: (v: any, r?: any) => {
    if (v == null) return "—";
    const s = +v, min = +(r?.stock_min ?? 0), max = +(r?.stock_max ?? Infinity);
    const color = s <= min ? "bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100"
                 : s >= max ? "bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100"
                 : "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100";
    return <Badge className={`px-2 py-1 text-xs font-medium ${color}`}>{s}</Badge>;
  },
  // — Edad
  edad: (v: any) => {
    if (!v) return "—";
    const m = String(v).match(/^(\d+)\s*(AÑO|MES)/i);
    if (!m) return v;
    const n = +m[1], u = m[2].toUpperCase();
    return u === "AÑO" ? plural(n, "año", "años") : plural(n, "mes", "meses");
  },
};
// HOOK PRINCIPAL (MEMOIZADO + ESCALABLE)
export const useRenderCellContent = () => {
  return React.useCallback((key: string, row: any, view?: string): React.ReactNode => {
    const v = $(row, key);
    if (v == null || v === "") return "—";
    const render = R[key];
    if (render) return render(v, row, view);
    // Fallback: cualquier campo con "imagen"
    if (key.toLowerCase().includes("imagen") && view) {
      return <ImageDialog v={v} view={view} />;
    }
    return v;
  }, []);
};
// EXPORT: Registro dinámico (opcional)
export const registerRenderer = (key: string, fn: RenderFn) => {
  R[key] = fn;
};