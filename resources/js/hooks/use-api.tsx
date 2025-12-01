// js/hooks/use-api.ts
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import axios, { AxiosRequestConfig } from "axios";
interface UseApiOptions extends AxiosRequestConfig {
  autoFetch?: boolean;
  interval?: number;
  initialData?: any;
  transform?: (data: any) => any;  
}
export function useApi<T = any>(url: string, options: UseApiOptions = {}) {
  const {
    autoFetch = true,
    interval = null,              
    initialData = null,
    transform,
    ...axiosOptions
  } = options;
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const stableAxiosOptions = useMemo(() => axiosOptions, []);
  const fetchApi = useCallback(async () => {
    controllerRef.current?.abort();
    controllerRef.current = new AbortController();
    setLoading(true);
    setError(null);
    try {
      const res = await axios({
        url,
        signal: controllerRef.current.signal,
        ...stableAxiosOptions,
      });
      const result = transform ? transform(res.data) : res.data;
      setData(result);
      return result;
    } catch (err: any) {
      if (err.name === "CanceledError") return;
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  }, [url, stableAxiosOptions, transform]);
  useEffect(() => {
    if (autoFetch) fetchApi();
    return () => controllerRef.current?.abort();
  }, [fetchApi, autoFetch]);
  // Interval SIEMPRE existe (por defecto 10s), pero puedes desactivarlo pasando interval = null
  useEffect(() => {
    if (!interval) return;              
    const id = setInterval(fetchApi, interval);
    return () => clearInterval(id);
  }, [interval, fetchApi]);

  return { data, loading, error, refetch: fetchApi };
}