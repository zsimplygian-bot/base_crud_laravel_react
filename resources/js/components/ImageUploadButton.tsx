// src/components/ImageUploadButton.tsx
import React, { useRef } from "react";

type Props = {
  setData: (field: string, value: any) => void;
  view: string;
};

const ImageUploadButton: React.FC<Props> = ({ setData, view }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("imagen", file);

    try {
      console.log(`[${view}] Enviando imagen al clasificador...`);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/clasificador-imagen`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Error al enviar la imagen");

      const json = await res.json();
      console.log(`[${view}] Respuesta del clasificador:`, json);

      if (json.error) {
        alert("Error: " + json.error);
        return;
      }

      // Mapear los valores al formulario
      setData("especie", json.especie);
      setData("raza", json.raza);
      setData("confianza", json.confianza);

    } catch (err: any) {
      console.error(`[${view}] Error en la subida:`, err.message);
      alert("No se pudo procesar la imagen.");
    } finally {
      // resetear input para permitir volver a subir
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        📷 Consulta Imagen
      </button>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default ImageUploadButton;
