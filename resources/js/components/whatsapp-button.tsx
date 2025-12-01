// resources/js/components/WhatsAppButton.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Loader2, CheckCircle2 } from "lucide-react";

interface WhatsAppButtonProps {
  telefono: string;
  mensaje: string;
  citaId: number;
}

export default function WhatsAppButton({ telefono, mensaje, citaId }: WhatsAppButtonProps) {
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const enviarAutomatico = async () => {
    if (enviando || enviado) return;

    if (!telefono) {
      alert("No se encontró el teléfono del cliente.");
      return;
    }

    let numeroWhatsApp = telefono.trim();
    if (!numeroWhatsApp.startsWith("51")) {
      numeroWhatsApp = "51" + numeroWhatsApp.replace(/^0+/, "");
    }

    setEnviando(true);

    try {
      // 1. Enviar mensaje por tu bot local
      const resBot = await fetch("http://127.0.0.1:3001/whatsapp-send", {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: numeroWhatsApp, message: mensaje }),
      });

      const dataBot = await resBot.json();
      if (!dataBot.success) throw new Error(dataBot.error || "Error del bot");

      // 2. Registrar notificación en Laravel (ruta en web.php → sin /api)
      const resNotif = await fetch(`/cita/${citaId}/notificar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "",
          "Accept": "application/json",
        },
      });

      if (!resNotif.ok) {
        console.warn("El mensaje se envió, pero no se pudo registrar la notificación en Laravel");
      }

      setEnviado(true);
      setTimeout(() => setEnviado(false), 5000);
    } catch (err: any) {
      console.error("Error enviando WhatsApp:", err);
      alert("Error: " + (err.message || "No se pudo enviar el mensaje"));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="mb-6">
      <Button
        onClick={enviarAutomatico}
        disabled={enviando}
        size="lg"
        className="flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg"
      >
        {enviando ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Enviando y registrando...
          </>
        ) : enviado ? (
          <>
            <CheckCircle2 className="w-5 h-5" />
            ¡Enviado y registrado!
          </>
        ) : (
          <>
            <MessageCircle className="w-5 h-5" />
            Enviar WhatsApp automáticamente
          </>
        )}
      </Button>

      <p className="text-sm text-gray-500 mt-3">
        El mensaje se envía y se registra la fecha de notificación automáticamente.
      </p>
    </div>
  );
}