import React, { useRef } from "react";

export type ApiConfigEntry = {
  inputKey: string;
  type: "text" | "file";
  endpoint: string;
  fields: Record<string, string>;
  emptyValue?: any;
};

type UseFetchWithButtonParams = {
  data: any;
  setData: (field: string, value: any) => void;
  apiConfig?: ApiConfigEntry;
  view: string;
};

export function useFetchWithButton({
  data,
  setData,
  apiConfig,
  view,
}: UseFetchWithButtonParams) {
  if (!apiConfig) return null;

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // --- TEXT FETCH ---
  const handleTextFetch = async () => {
    const val = data[apiConfig.inputKey]?.trim();
    if (!val) return alert("El campo no puede estar vacío");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/${apiConfig.endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [apiConfig.inputKey]: val }),
      });
      const json = await res.json();
      console.log(`[${view}] Respuesta API texto:`, json);

      Object.entries(apiConfig.fields).forEach(([field, jsonKey]) =>
        setData(field, json[jsonKey] ?? apiConfig.emptyValue)
      );
    } catch (e: any) {
      console.error(`[${view}]`, e);
      Object.keys(apiConfig.fields).forEach((f) => setData(f, apiConfig.emptyValue));
    }
  };

  // --- IMAGE FETCH ---
  const handleImageFetch = async (file: File) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("imagen", file);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/${apiConfig.endpoint}`, {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      console.log(`[${view}] Respuesta API imagen:`, json);

      Object.entries(apiConfig.fields).forEach(([field, jsonKey]) =>
        setData(field, json[jsonKey] ?? apiConfig.emptyValue)
      );
    } catch (e: any) {
      console.error(`[${view}]`, e);
      Object.keys(apiConfig.fields).forEach((f) => setData(f, apiConfig.emptyValue));
    }
  };

  // --- BOTÓN RENDER ---
  const FetchButton = ({ fieldKey }: { fieldKey: string }) => {
    if (fieldKey !== apiConfig.inputKey) return null;

    if (apiConfig.type === "file") {
      return (
        <>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageFetch(file);
            }}
          />
          <button
            type="button"
            className="px-2 py-1 bg-blue-200 rounded hover:bg-blue-300 ml-1"
            onClick={() => fileInputRef.current?.click()}
          >
            📂 Buscar imagen
          </button>
        </>
      );
    }

    if (apiConfig.type === "text") {
      return (
        <button
          type="button"
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 ml-1"
          onClick={handleTextFetch}
        >
          🔍
        </button>
      );
    }

    return null;
  };

  return FetchButton;
}

export type { UseFetchWithButtonParams };
