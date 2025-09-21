import { useEffect, useRef, useState, useMemo, useCallback } from "react";
interface Option {
  id: number | string;
  label: string;
  [key: string]: any;
}
export function useFilteredDistricts(
  provinciaSeleccionada: string,
  opcionesDistrito: Option[],
  view: string
) {
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  // Memoiza los distritos filtrados
  const distritosFiltrados = useMemo(() => {
    if (view === "distrito") {
      // Si estamos en la vista de distrito, no se filtra
      return opcionesDistrito || [];
    }
    if (!opcionesDistrito?.length) return [];
    const noEspecificado = opcionesDistrito.find(
      (opt) => opt.label.trim().toUpperCase() === "NO ESPECIFICADO"
    );
    let filtered = opcionesDistrito.filter(
      (opt) => opt.label.trim().toUpperCase() !== "NO ESPECIFICADO"
    );
    if (provinciaSeleccionada) {
      filtered = filtered.filter((opt) =>
        opt.id.toString().startsWith(provinciaSeleccionada)
      );
    } else {
      filtered = [];
    }
    filtered = filtered.filter((opt) =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return noEspecificado ? [noEspecificado, ...filtered] : filtered;
  }, [provinciaSeleccionada, opcionesDistrito, searchTerm, view]);
  // Maneja la apertura del select para enfocar el input de búsqueda
  const handleOpenChange = useCallback(
    (
      open: boolean,
      firstKeyPressed: string | null,
      setFirstKeyPressed: (key: string | null) => void
    ) => {
      if (!open) {
        setFirstKeyPressed(null);
      } else {
        setTimeout(() => {
          if (searchInputRef.current) {
            searchInputRef.current.focus();
            if (firstKeyPressed) {
              setSearchTerm(firstKeyPressed);
              setFirstKeyPressed(null);
            }
          }
        }, 100);
      }
    },
    []
  );
  const clearSearch = useCallback(() => setSearchTerm(""), []);
  return {
    distritosFiltrados,
    searchTerm,
    setSearchTerm,
    searchInputRef,
    handleOpenChange,
    clearSearch,
  };
}