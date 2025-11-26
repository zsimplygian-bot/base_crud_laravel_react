import { useEffect, useState, useCallback } from "react";
import { ExpandIcon, MinimizeIcon } from "lucide-react";
export function FullscreenToggleButton() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  // Detecta estado inicial y cambios
  useEffect(() => {
    const syncState = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    syncState(); // estado inicial
    document.addEventListener("fullscreenchange", syncState);
    return () => {
      document.removeEventListener("fullscreenchange", syncState);
    };
  }, []);
  // Función estable para evitar re-renders
  const toggleFullscreen = useCallback(async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await document.documentElement.requestFullscreen();
    }
  }, []);
  return (
    <button
      onClick={toggleFullscreen}
      className="p-2 rounded hover:bg-accent transition-colors"
      title={isFullscreen ? "Salir de Pantalla Completa" : "Pantalla Completa"}
    >
      {isFullscreen ? (
        <MinimizeIcon className="h-5 w-5" />
      ) : (
        <ExpandIcon className="h-5 w-5" />
      )}
    </button>
  );
}