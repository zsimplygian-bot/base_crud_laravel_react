import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import SettingsLayout from "@/layouts/settings/layout";
import HeadingSmall from "@/components/heading-small";
import { SmartButton } from "@/components/smart-button";
import { Database, Upload } from "lucide-react";
export default function DatabaseSettings() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<"import" | "export" | null>(null);
  const handleExport = () => {
    setLoading("export");
    window.location.href = route("export.db");
    setTimeout(() => setLoading(null), 2000);
    toast.success("Descarga iniciada.");
  };
  const handleImport = async () => {
    if (!file) return;
    setLoading("import");
    const formData = new FormData();
    formData.append("backup", file);
    try {
      const { data } = await axios.post(route("import.db"), formData);
      toast.success(data.msg || "Base de datos restaurada.");
      setFile(null);
    } catch (err: any) {
      toast.error(err.response?.data?.msg || "Error en la importación.");
    } finally {
      setLoading(null);
    }
  };
  return (
    <AppLayout>
      <Head title="Base de Datos" />
      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall {...{ title: "Base de datos", description: "Gestión de respaldos" }} />
          <SmartButton  {...{ icons: Database, label: "Exportar Base de Datos", 
            loadingLabel: "Exportando...", isLoading: loading === "export", onClick: handleExport }} 
          />
          <div className="mt-2 flex items-center gap-3">
            <input {...{ type: "file", accept: ".sql", className: "rounded-full border p-2 text-sm", 
              onChange: (e: any) => setFile(e.target.files?.[0] || null)  }} 
            />
            <SmartButton {...{ icons: Upload, label: "Importar Base de Datos", loadingLabel: "Importando...", isLoading: loading === "import", 
              disabled: !file || !!loading, variant: "secondary", 
              confirmation: { title: "Confirmar importación", description: "¿Sobrescribir base de datos actual?" }, onClick: handleImport }}
            />
          </div>
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}