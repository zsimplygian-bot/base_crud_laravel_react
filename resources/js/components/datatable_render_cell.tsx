import React from "react";
import { Button } from "@/components/ui/button";
import { PhoneIcon } from "lucide-react";
// Utilidad para acceder a campos anidados tipo "docu.docu"
const getNestedValue = (obj: any, path: string): any =>
  path.split(".").reduce((acc, key) => acc?.[key], obj);
type RenderFunction = (value: any, row?: any, view?: string) => React.ReactNode;
const EstadoBadge = (value: any) => {
  const isActive = value === "ACTIVO";
  const classes = isActive
    ? "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100"
    : "bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100";
  return (
    <span className={`px-2 py-1 rounded text-sm font-medium ${classes}`}>
      {value ?? "—"}
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
  valor: (value: any) => <span>S/. {Number(value).toFixed(2)}</span>,
  total: (value: any) => <span>S/. {Number(value).toFixed(2)}</span>,
  precio: (value: any) => <span>S/. {Number(value).toFixed(2)}</span>,
  estado: EstadoBadge,
  estado_delega: EstadoBadge,
  imagen: (value: any, _row, view) => ImageCell(value, view),
  stock: (value: any, row?: any) => {
    if (value === null || value === undefined) return "—";
    const stock = Number(value);
    const min = Number(row?.stock_min ?? 0);
    const max = Number(row?.stock_max ?? Infinity);
    let style = "text-sm font-medium px-2 py-1 rounded";
    if (stock <= min) {
      style += " bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100";
    } else if (stock >= max) {
      style +=
        " bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100";
    } else {
      style += " text-foreground dark:text-white";
    }
    return <span className={style}>{stock}</span>;
  },
  edad: (value: any) => {
    if (!value) return "—";
    const match = String(value).match(/^(\d+)\s*(AÑO|MES)$/i);
    if (!match) return value;

    const cantidad = Number(match[1]);
    const unidad = match[2].toUpperCase();

    if (unidad === "AÑO") {
      return cantidad === 1 ? "1 AÑO" : `${cantidad} AÑOS`;
    } else if (unidad === "MES") {
      return cantidad === 1 ? "1 MES" : `${cantidad} MESES`;
    }

    return value;
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
    // Usar renderizador directo si existe
    if (renderMap[accessor]) {
      return renderMap[accessor](value, row, view);
    }
    // Fallback: campos con nombre tipo "imagen"
    if (accessor.toLowerCase().includes("imagen") && view && !isEmpty) {
      return ImageCell(value, view);
    }
    return isEmpty ? "—" : value;
  };
  return renderCellContent;
};