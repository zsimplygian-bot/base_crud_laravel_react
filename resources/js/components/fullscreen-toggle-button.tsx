// components/fulllscreen-toggle-button.tsx
import { useEffect, useState, useCallback } from "react"
import { ExpandIcon, MinimizeIcon } from "lucide-react"
import { SmartButton } from "@/components/smart-button"
export function FullscreenToggleButton() {
  const [isFullscreen, setIsFullscreen] = useState(false) // Estado que indica si estamos en pantalla completa
  useEffect(() => {
    const syncState = () => { 
      setIsFullscreen(Boolean(document.fullscreenElement)) // Actualiza el estado según si hay un elemento en fullscreen
    }
    syncState() // Inicializa el estado al montar el componente
    document.addEventListener("fullscreenchange", syncState) // Escucha cambios de fullscreen globales
    return () => document.removeEventListener("fullscreenchange", syncState) // Limpia el listener al desmontar
  }, []) // [] asegura que se ejecute solo al montar/desmontar
  const toggleFullscreen = useCallback(async () => {
    if (document.fullscreenElement) await document.exitFullscreen() // Sale de pantalla completa si hay un elemento
    else await document.documentElement.requestFullscreen() // Entra en pantalla completa si no hay ninguno
  }, []) // [] asegura que la función no se recree entre renders
  return (
    <SmartButton {...{icon: isFullscreen ? MinimizeIcon : ExpandIcon, 
                      tooltip: isFullscreen ? "Salir de pantalla completa" : "Pantalla completa", 
                      variant: "ghost", onClick: toggleFullscreen}} />
  )
}