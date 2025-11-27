// src/components/app-toaster-handler.tsx
import { useEffect, useRef } from "react";
import { usePage } from "@inertiajs/react";
import { toast, Toaster } from "@/components/ui/sonner";
export default function AppToasterHandler() {
  const { props: pageProps } = usePage();
  const shownRef = useRef<{ success?: boolean; error?: boolean }>({});
  useEffect(() => {
    if (pageProps.success && !shownRef.current.success) {
      const msg = pageProps.success as string;
      let borderColor = "#3b83f6d7";
      if (msg.includes("actualizado")) borderColor = "#22c55ed5";
      if (msg.includes("eliminado")) borderColor = "#ef4444da";
      toast.success(msg, {
        style: { border: `1.5px solid ${borderColor}` },
      });
      shownRef.current.success = true;
    }
    if (pageProps.error && !shownRef.current.error) {
      toast.error(pageProps.error, {
        style: { border: "2px solid #ef4444" },
      });
      shownRef.current.error = true;
    }
  }, [pageProps.success, pageProps.error]);
  return <Toaster position="top-center" closeButton theme="dark" />;
}