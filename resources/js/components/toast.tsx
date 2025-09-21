// components/toast.tsx
import * as React from "react";
import { useState, useEffect } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const toastVariants = cva(
  "fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-sm font-medium w-80",
  {
    variants: {
      variant: {
        default: "bg-gray-800 text-white",
        success: "bg-green-600 text-white",
        error: "bg-red-600 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface ToastProps {
  message: string;
  variant?: "default" | "success" | "error";
  duration?: number; // Duración en milisegundos
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, variant = "default", duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose(); // Llamamos la función onClose para ocultar el toast en el componente padre
    }, duration);

    return () => clearTimeout(timer); // Limpiamos el temporizador al desmontar
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className={cn(toastVariants({ variant }))}>
      {message}
    </div>
  );
};

export default Toast;
