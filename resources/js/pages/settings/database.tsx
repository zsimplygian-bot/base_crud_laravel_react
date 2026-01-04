import { Head, router } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import SettingsLayout from "@/layouts/settings/layout"
import HeadingSmall from "@/components/heading-small"
import { SmartButton } from "@/components/smart-button"
import { Database, Upload } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"
export default function DatabaseSettings() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  /** EXPORTAR */
  const handleExport = async () => {
    // pequeño delay para que se vea el loader
    await new Promise((r) => setTimeout(r, 300))
    window.open(route("export.db"), "_self")
  }
  /** IMPORTAR */
  const handleImport = async () => {
    if (!file) return
    const formData = new FormData()
    formData.append("backup", file)
    await router.post(route("import.db"), formData)
    setDialogOpen(true)
  }
  return (
    <AppLayout>
      <Head title="Base de Datos" />
      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall
            title="Base de datos"
            description="Exportar o importar información"
          />
          {/* EXPORTAR */}
          <SmartButton
            icon={Database}
            label="Exportar Base de Datos"
            loadingLabel="Exportando..."
            onClick={handleExport}
          />
          {/* IMPORTAR */}
          <div className="flex items-center gap-3 mt-2">
            <input
              type="file"
              accept=".sql,.txt"
              className="rounded border p-2 text-sm"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <SmartButton
              icon={Upload}
              label="Importar Base de Datos"
              loadingLabel="Importando..."
              variant="secondary"
              disabled={!file}
              onClick={handleImport}
            />
          </div>
        </div>
      </SettingsLayout>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Operación completada</DialogTitle>
          </DialogHeader>
          <p>La operación se completó correctamente.</p>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}