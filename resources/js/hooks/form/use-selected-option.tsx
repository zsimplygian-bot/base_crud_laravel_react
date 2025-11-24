import { useEffect, useState, useRef } from "react";

export function useSelectedOption(fieldKey, value) {
  const [selected, setSelected] = useState(null);
  const [loadingSelected, setLoadingSelected] = useState(false);

  const cache = useRef({});

  // ⛔️ EVITAR FETCH para dashboard_table
  const skip = fieldKey === "dashboard_table";

  useEffect(() => {
    // Si no tiene valor o el campo está marcado para ignorar
    if (!value || skip) {
      setSelected(null);
      return;
    }

    const cacheKey = `${fieldKey}:${value}`;

    if (cache.current[cacheKey]) {
      setSelected(cache.current[cacheKey]);
      return;
    }

    let cancelled = false;
    setLoadingSelected(true);

    (async () => {
      try {
        const res = await fetch(
          `/api/listas/item?campo=${fieldKey}&id=${encodeURIComponent(value)}`
        );
        const json = await res.json();

        if (!cancelled && json.success && json.data) {
          cache.current[cacheKey] = json.data;
          setSelected(json.data);
        }
      } catch (e) {
        console.error("useSelectedOption error", e);
      } finally {
        if (!cancelled) setLoadingSelected(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [fieldKey, value, skip]);

  return { selected, loadingSelected };
}
