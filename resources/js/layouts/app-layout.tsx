import AppLayoutTemplate from "@/layouts/app/app-sidebar-layout";
import { type BreadcrumbItem } from "@/types";
import { type ReactNode, useEffect, useState, useRef } from "react";
import { Head, usePage } from "@inertiajs/react";
import { Toaster, toast } from "@/components/ui/sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
interface AppLayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}
export default function AppLayout({ children, breadcrumbs, ...props }: AppLayoutProps) {
  const { props: pageProps } = usePage();
  const [dialog, setDialog] = useState<{ title: string; content: string } | null>(null);
  const shownRef = useRef<{ success?: boolean; error?: boolean }>({});
  useEffect(() => {
    if (pageProps.success && !shownRef.current.success) {
      const msg = pageProps.success as string;
      // Determinar color por tipo de mensaje
      let borderColor = "#3b83f6d7"; // azul (create)
      if (msg.includes("actualizado")) borderColor = "#22c55ed5"; // verde (update)
      if (msg.includes("eliminado")) borderColor = "#ef4444da";   // rojo (delete)
      toast.success(msg, {
        style: {
          border: `1.5px solid ${borderColor}`,
        },
      });
      shownRef.current.success = true;
    }
    if (pageProps.error && !shownRef.current.error) {
      toast.error(pageProps.error, {
        style: {
          border: "2px solid #ef4444",
        },
      });
      shownRef.current.error = true;
    }
    //if (pageProps.errors && Object.keys(pageProps.errors).length > 0) {
      //const errorMessages = Object.values(pageProps.errors)
        //.map((v) => (Array.isArray(v) ? v.join(", ") : v))
        //.join(" | ");
      //setDialog({
        //title: "Advertencia",
        //content: errorMessages,
      //});
    //}
  }, [pageProps.success, pageProps.error, pageProps.errors]);
  return (
    <AppLayoutTemplate breadcrumbs={breadcrumbs}>
      <Head />  {/* <<--- AQUÍ ESTA LA SOLUCIÓN */}
      {children}

      <Dialog open={!!dialog} onOpenChange={() => setDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialog?.title}</DialogTitle>
          </DialogHeader>
          <p>{dialog?.content}</p>
        </DialogContent>
      </Dialog>

      <Toaster position="top-center" closeButton theme="dark" />
    </AppLayoutTemplate>
  );
}