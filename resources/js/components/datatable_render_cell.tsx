import React from "react";
import { Button } from "@/components/ui/button";
import { PhoneIcon, Mars, Venus, DropletIcon } from "lucide-react"; // 👈 Íconos válidos

// Utilidad para acceder a campos anidados tipo "docu.docu"
const getNestedValue = (obj: any, path: string): any =>
  path.split(".").reduce((acc, key) => acc?.[key], obj);

type RenderFunction = (value: any, row?: any, view?: string) => React.ReactNode;

const EstadoBadge = (value: any) => {
  const estado = String(value || "").toUpperCase();

  let classes = "";

  if (["ACTIVO", "ATENDIDO", "ABIERTO"].includes(estado)) {
    classes = "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100";
  } else if (estado === "REFERIDO") {
    classes = "bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100";
  } else if (["CERRADO", "EN OBSERVACIÓN"].includes(estado)) {
    classes = "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
  } else {
    classes = "bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100";
  }

  return (
    <span className={`px-2 py-1 rounded text-sm font-medium ${classes}`}>
      {estado || "—"}
    </span>
  );
};

const ImageCell = (value: any, view?: string) => {
  if (!value || !view) return "—";
  const imagePath = `/images/${view}/${value}`;
  return (
    <img
      src={imagePath}
      alt="Imagen"
      className="h-12 w-12 object-cover rounded-md border"
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
    />
  );
};

const renderMap: Record<string, RenderFunction> = {
  telefono: (value: any) => {
    const phone = value?.replace(/\D/g, "");
    return phone ? (
      <Button
        asChild
        size="sm"
        className="bg-green-600 text-white hover:bg-green-700 dark:bg-green-800 dark:hover:bg-green-900"
      >
        <a
          href={`https://wa.me/51${phone}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2"
        >
          <PhoneIcon className="w-4 h-4" />
          {value}
        </a>
      </Button>
    ) : (
      <Button
        size="sm"
        disabled
        className="bg-muted text-muted-foreground opacity-80 cursor-not-allowed"
      >
        <PhoneIcon className="w-4 h-4 mr-1" />
        —
      </Button>
    );
  },

  valor: (v: any) => <span>S/. {Number(v).toFixed(2)}</span>,
  total: (v: any) => <span>S/. {Number(v).toFixed(2)}</span>,
  precio: (v: any) => <span>S/. {Number(v).toFixed(2)}</span>,
  peso: (v: any) => (
    <span>{v !== null && v !== undefined ? `${Number(v).toFixed(2)} kg` : "—"}</span>
  ),
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
    const lowerText = text.toLowerCase();
    const especie = especies.find((e) => lowerText.startsWith(e.key));
    const icon = especie ? especie.icon : "🐾";
    // Remueve "Especie -" dejando solo la raza
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
  // 👇 Nuevo render de campo "sexo" con íconos
  sexo: (v: any) => {
  if (!v) return "—";
    const isMale = v.toLowerCase().includes("macho");
    const color = isMale
      ? "text-blue-600 dark:text-blue-400"
      : "text-pink-600 dark:text-pink-400";
    const Icon = isMale ? Mars : Venus;
    return (
      <span className={`inline-flex items-center gap-2 font-medium ${color}`}>
        <Icon className="w-4 h-4" />
        
      </span>
    );
  },
  color: (v: any) => {
    if (!v) return "—";
    const colorMap: Record<string, string> = {
      negro: "#000000",
      marrón: "#7B3F00",
      marron: "#7B3F00",
      acero: "#A8A9AD",
      ceniza: "#B2BEB5",
      crema: "#fffcd0ff",
      blanco: "#FFFFFF",
      gris: "#808080",
      dorado: "#DAA520",
      rojo: "#FF0000",
      azul: "#0000FF",
      verde: "#008000",
    };
    const text = v.trim();
    const [firstWord, ...rest] = text.split(" ");
    const firstKey = firstWord
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    const baseColor = colorMap[firstKey] ?? "#999999";
    const borderColor =
    baseColor.toLowerCase() === "#000000" ? "#FFFFFF" : "#000000";
    const dropletIcon = (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2C12 2 6 9 6 14a6 6 0 0012 0c0-5-6-12-6-12z"
          fill={baseColor}
          stroke={borderColor}
          strokeWidth="0.6"
        />
      </svg>
    );
    const remainingText = rest.join(" ").trim();
    return (
      <span className="inline-flex items-center gap-2 font-medium text-foreground">
        {dropletIcon}
        {remainingText || ""}
      </span>
    );
  },
  stock: (v: any, row?: any) => {
    if (v === null || v === undefined) return "—";
    const stock = Number(v);
    const min = Number(row?.stock_min ?? 0);
    const max = Number(row?.stock_max ?? Infinity);
    let style = "text-sm font-medium px-2 py-1 rounded";
    if (stock <= min)
      style += " bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100";
    else if (stock >= max)
      style +=
        " bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100";
    else style += " text-foreground dark:text-white";
    return <span className={style}>{stock}</span>;
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
export const useRenderCellContent = () => {
  const renderCellContent = (
    accessor: string,
    row: any,
    view?: string
  ): React.ReactNode => {
    const value = getNestedValue(row, accessor);
    const isEmpty = value === null || value === undefined || value === "";
    if (renderMap[accessor]) return renderMap[accessor](value, row, view);
    if (accessor.toLowerCase().includes("imagen") && view && !isEmpty)
      return ImageCell(value, view);
    return isEmpty ? "—" : value;
  };
  return renderCellContent;
};