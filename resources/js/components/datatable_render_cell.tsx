import React from "react";
import { PhoneIcon, Mars, Venus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

// Utilidad: obtener valores anidados tipo "docu.docu"
const getNestedValue = (obj: any, path: string): any =>
  path.split(".").reduce((acc, key) => acc?.[key], obj);

// Badge dinámico para estado
const EstadoBadge = (value: any) => {
  const estado = String(value || "").toUpperCase();

  const colorMap: Record<string, string> = {
    ACTIVO: "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100",
    ATENDIDO: "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100",
    ABIERTO: "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100",
    REFERIDO: "bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100",
    CERRADO: "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    "EN OBSERVACIÓN": "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  };

  const colorClass =
    colorMap[estado] ||
    "bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100";

  return (
    <Badge className={`px-2 py-1 text-xs font-medium ${colorClass}`}>
      {estado || "—"}
    </Badge>
  );
};

// Render de imagen con Dialog para vista ampliada
const ImageCell = (value: any, view?: string) => {
  if (!value || !view) return "—";
  const imagePath = `/images/${view}/${value}`;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <img
          src={imagePath}
          alt="Imagen"
          className="h-12 w-12 object-cover rounded-md border cursor-pointer hover:opacity-80 transition-opacity"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      </DialogTrigger>
      <DialogContent className="max-h-[150vh] max-h-[150vh] p-0">
        <img
          src={imagePath}
          alt="Imagen ampliada"
          className="w-full h-full object-contain rounded-md"
        />
      </DialogContent>
    </Dialog>
  );
};

// Mapa de renderizadores
type RenderFunction = (value: any, row?: any, view?: string) => React.ReactNode;

export const renderMap: Record<string, RenderFunction> = {
  telefono: (value: any) => {
    const phone = value?.replace(/\D/g, "");
    if (!phone) {
      return (
        <Badge
          variant="outline"
          className="border-gray-300 text-gray-500 dark:border-gray-600 dark:text-gray-300 cursor-not-allowed"
        >
          <span className="inline-flex items-center gap-2 text-sm">
            <PhoneIcon className="w-4 h-4" />
            —
          </span>
        </Badge>
      );
    }
    return (
      <Badge
        variant="outline"
        className="border-green-600 text-green-600 dark:border-green-400 dark:text-green-400 hover:bg-green-600/10 dark:hover:bg-green-400/10"
      >
        <a
          href={`https://wa.me/51${phone}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm"
        >
          <PhoneIcon className="w-4 h-4" />
          {value}
        </a>
      </Badge>
    );
  },

  valor: (v: any) => <span>S/. {Number(v).toFixed(2)}</span>,
  total: (v: any) => <span>S/. {Number(v).toFixed(2)}</span>,
  precio: (v: any) => <span>S/. {Number(v).toFixed(2)}</span>,
  peso: (v: any) => (v != null ? `${Number(v).toFixed(2)} kg` : "—"),

  estado: EstadoBadge,
  estado_delega: EstadoBadge,
  imagen: (v: any, _r, view) => ImageCell(v, view),

  raza: (v: any) => {
    if (!v) return "—";
    const especies = [
      { key: "canino", icon: "🐶" },
      { key: "felino", icon: "🐱" },
      { key: "conejo", icon: "🐰" },
      { key: "ave", icon: "🐦" },
    ];
    const text = String(v).trim();
    const especie = especies.find((e) => text.toLowerCase().startsWith(e.key));
    const icon = especie ? especie.icon : "🐾";
    const cleanText = especie
      ? text.replace(new RegExp(`^${especie.key}\\s*-\\s*`, "i"), "").trim()
      : text;
    return (
      <span className="inline-flex items-center gap-2 text-foreground">
        <span className="text-xl leading-none">{icon}</span>
        {cleanText || ""}
      </span>
    );
  },

  sexo: (v: any) => {
    if (!v) return "—";
    const isMale = v.toLowerCase().includes("macho");
    const Icon = isMale ? Mars : Venus;
    const color = isMale
      ? "text-blue-600 dark:text-blue-400"
      : "text-pink-600 dark:text-pink-400";
    return (
      <span className={`inline-flex items-center gap-2 font-medium ${color}`}>
        <Icon className="" />
      </span>
    );
  },

color: (v: any) => {
  if (!v) return "—";

  const colorMap: Record<string, string> = {
    negro: "#000000",
    negras: "#000000",
    marrón: "#7B3F00",
    marron: "#7B3F00",
    acero: "#A8A9AD",
    cenizo: "#B2BEB5",
    crema: "#fff0bfff",
    blanco: "#FFFFFF",
    gris: "#808080",
    plomo: "#808080",
    dorado: "#DAA520",
    rojo: "#FF0000",
    azul: "#0000FF",
    verde: "#008000",
    rosa: "#FFC0CB",
    naranja: "#FFA500",
    morado: "#800080",
    caramelo: "#FF7F50",
    beige: "#F5F5DC",
    fuego: "#FF4500",
  };

  const ignoreWords = ["con", "y", "de", "manchas", "claro", "oscuro"];
  const parts = v
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word && !ignoreWords.includes(word));

  const colors: string[] = parts.map(p => colorMap[p] ?? "#999999");
  const background = colors.length > 1
    ? `linear-gradient(to right, ${colors.join(", ")})`
    : colors[0];

  return (
    <div className="inline-flex items-center gap-2" style={{ lineHeight: 1 }}>
      <Badge
        className="w-8 h-7 rounded-full border border-gray-600 p-0"
        style={{ background, color: "#000000" }}
      />
      
    </div>
  );
},



  stock: (v: any, row?: any) => {
    if (v == null) return "—";
    const stock = Number(v);
    const min = Number(row?.stock_min ?? 0);
    const max = Number(row?.stock_max ?? Infinity);

    let classes =
      "px-2 py-1 rounded text-xs font-medium border border-transparent";

    if (stock <= min)
      classes += " bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100";
    else if (stock >= max)
      classes +=
        " bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100";
    else
      classes +=
        " bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100";

    return <Badge className={classes}>{stock}</Badge>;
  },

  edad: (v: any) => {
    if (!v) return "—";
    const match = String(v).match(/^(\d+)\s*(AÑO|MES)$/i);
    if (!match) return v;
    const cantidad = Number(match[1]);
    const unidad = match[2].toUpperCase();
    if (unidad === "AÑO") return cantidad === 1 ? "1 año" : `${cantidad} años`;
    if (unidad === "MES") return cantidad === 1 ? "1 mes" : `${cantidad} meses`;
    return v;
  },
};

// Hook: renderizador principal
export const useRenderCellContent = () => {
  const renderCellContent = (
    accessor: string,
    row: any,
    view?: string
  ): React.ReactNode => {
    const value = getNestedValue(row, accessor);
    const isEmpty = value == null || value === "";
    if (renderMap[accessor]) return renderMap[accessor](value, row, view);
    if (accessor.toLowerCase().includes("imagen") && view && !isEmpty)
      return ImageCell(value, view);
    return isEmpty ? "—" : value;
  };
  return renderCellContent;
};