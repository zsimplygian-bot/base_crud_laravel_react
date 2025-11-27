// src/hooks/useApi.ts
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import axios, { AxiosRequestConfig } from "axios";
interface UseApiOptions extends AxiosRequestConfig {
  autoFetch?: boolean;
  interval?: number;
  initialData?: any;
  transform?: (data: any) => any;   // <--- Transformador opcional
}
export function useApi<T = any>(url: string, options: UseApiOptions = {}) {
  const {
    autoFetch = true,
    interval,
    initialData = null,
    transform,
    ...axiosOptions
  } = options;
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  // Memo estable para evitar recrear options a cada render
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
  // Auto-fetch
  useEffect(() => {
    if (autoFetch) fetchApi();
    return () => controllerRef.current?.abort();
  }, [fetchApi, autoFetch]);
  // Interval estable
  useEffect(() => {
    if (!interval) return;
    const id = setInterval(fetchApi, interval);
    return () => clearInterval(id);
  }, [interval, fetchApi]);
  return { data, loading, error, refetch: fetchApi };
}