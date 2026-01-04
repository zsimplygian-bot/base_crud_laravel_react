import { useEffect, useRef, useState, useCallback } from "react";
import axios, { AxiosRequestConfig } from "axios";

interface UseApiOptions extends AxiosRequestConfig {
  autoFetch?: boolean;
  interval?: number;
  initialData?: any;
  transform?: (data: any) => any;
}

export function useApi<T = any>(url?: string, options: UseApiOptions = {}) {
  const {
    autoFetch = true,
    interval = null,
    initialData = null,
    transform,
    params: externalParams,
    ...axiosOptions
  } = options;

  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(autoFetch && !!url);
  const [error, setError] = useState<any>(null);

  const controllerRef = useRef<AbortController | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // fetchApi NO depende de params → identidad estable siempre
  const fetchApi = useCallback(
    async (overrideParams?: Record<string, any>) => {
      if (!url) return;

      controllerRef.current?.abort();
      controllerRef.current = new AbortController();

      setLoading(true);
      setError(null);

      try {
        const response = await axios({
          url,
          signal: controllerRef.current.signal,
          params: overrideParams ?? externalParams,
          ...axiosOptions,
        });

        const transformed = transform ? transform(response.data) : response.data;
        setData(transformed);
        return transformed;
      } catch (err: any) {
        if (err.name === "CanceledError") return;
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    // Dependencias completamente estables
    [url, transform, axiosOptions, externalParams] // externalParams sí debe estar aquí
  );

  // Solo ejecuta autoFetch inicial o por intervalo
  useEffect(() => {
    if (!autoFetch || !url) return;

    fetchApi();

    if (interval) {
      intervalRef.current = setInterval(() => fetchApi(), interval);
    }

    return () => {
      controllerRef.current?.abort();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoFetch, url, interval, fetchApi]);

  return {
    data,
    loading,
    error,
    refetch: fetchApi, // Identidad estable
  };
}