import { Head, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import SettingsLayout from "@/layouts/settings/layout";
import HeadingSmall from "@/components/heading-small";
import { type BreadcrumbItem } from "@/types";
import { Button } from "@/components/ui/button";
import * as LucideIcons from "lucide-react";
import { Loader2, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Opciones de base de datos",
    href: "/settings/database",
  },
];

export default function DatabaseSettings() {
  const DatabaseIcon = LucideIcons.Database;

  const [loadingExport, setLoadingExport] = useState(false);
  const [loadingImport, setLoadingImport] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [file, setFile] = useState<File | null>(null);

  const handleExport = () => {
    setLoadingExport(true);

    window.location.href = route("export.db");

    setTimeout(() => {
      setLoadingExport(false);
      setDialogOpen(true);
    }, 2000);
  };

  const handleImport = () => {
    if (!file) return;

    setLoadingImport(true);

    const formData = new FormData();
    formData.append("backup", file);

    router.post(route("import.db"), formData, {
      onFinish: () => {
        setLoadingImport(false);
        setDialogOpen(true);
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Base de Datos" />

      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall title="Base de datos" description="Exportar o importar" />

          {/* EXPORTAR */}
          <div className="flex justify-start">
            <Button
              variant="default"
              size="sm"
              className="flex items-center gap-2"
              onClick={handleExport}
              disabled={loadingExport}
            >
              {loadingExport ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <DatabaseIcon className="w-4 h-4" />
              )}

              {loadingExport ? "Exportando..." : "Exportar Base de Datos"}
            </Button>
          </div>

          {/* IMPORTAR */}
          <div className="flex items-center gap-3 mt-6">
            <input
              type="file"
              accept=".sql,.txt"
              className="border rounded p-2 text-sm"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />

            <Button
              variant="secondary"
              size="sm"
              className="flex items-center gap-2"
              onClick={handleImport}
              disabled={loadingImport || !file}
            >
              {loadingImport ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {loadingImport ? "Importando..." : "Importar Base de Datos"}
            </Button>
          </div>
        </div>
      </SettingsLayout>

      {/* DIALOG */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Operación completada</DialogTitle>
          </DialogHeader>
          <p>La operación se completó correctamente.</p>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
