import { useEffect } from "react";
import { useApi } from "@/hooks/use-api";

export const useLista = (campo, param, enabled = true) => {
  const query = campo
    ? `/api/listas?campo=${campo}${param ? `&param=${param}` : ""}`
    : null;

  const { data, loading, error, refetch } = useApi(query, { autoFetch: false });

  // Ejecuta fetch solo cuando enabled pasa a true
  useEffect(() => {
    if (enabled && query) refetch();
  }, [enabled, query]);

  return {
    options: data?.data ?? [],
    loading,
    error,
  };
};
