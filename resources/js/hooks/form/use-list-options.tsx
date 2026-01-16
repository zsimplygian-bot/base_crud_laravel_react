import { useEffect, useState, useCallback } from "react";

const cache: Record<string, any[]> = {};

export function useListOptions(fieldKey: string, param?: string | null) {
  // ================================
  // CASO ESPECIAL: dashboard_table
  // ================================
  if (fieldKey === "dashboard_table") {
    const hardcoded = [
      { id: "cita", label: "CITAS" },
      { id: "mascota", label: "MASCOTAS" },
      { id: "cliente", label: "CLIENTES" },
      { id: "historia_clinica", label: "HISTORIA CLÍNICA" },
    ];

    // jamás hace fetch, jamás cambia estado
    return {
      options: hardcoded,
      loading: false,
      loaded: true,
      loadFullList: () => Promise.resolve(),
    };
  }

  // ================================
  // CASO NORMAL
  // ================================
  const [options, setOptions] = useState<any[]>(cache[fieldKey] || []);
  const [loading, setLoading] = useState(!cache[fieldKey]);
  const [loaded, setLoaded] = useState(!!cache[fieldKey]);

  const loadFullList = useCallback(async () => {
    if (loaded) return;

    setLoading(true);
    try {
      const urlParam = param ? `&param=${encodeURIComponent(param)}` : "";
      const res = await fetch(`/api/listas?campo=${fieldKey}${urlParam}`);
      const json = await res.json();

      if (json.success && Array.isArray(json.data)) {
        cache[fieldKey] = json.data;
        setOptions(json.data);
      } else {
        setOptions([]);
      }
    } finally {
      setLoading(false);
      setLoaded(true);
    }
  }, [fieldKey, param, loaded]);

  return { options, loading, loaded, loadFullList };
}
