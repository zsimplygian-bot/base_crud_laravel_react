import { Head } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import SettingsLayout from "@/layouts/settings/layout"
import HeadingSmall from "@/components/heading-small"
import { SmartButton } from "@/components/smart-button"
import { Database, Upload } from "lucide-react"
import { useState } from "react"
import axios from "axios"
import { toast } from "@/components/ui/sonner"
export default function DatabaseSettings() {
  const [file, setFile] = useState<File | null>(null)
  /** EXPORTAR */
  const handleExport = async () => {
    try {
      const r = await axios.get(route("export.db"), { responseType: "blob" }) // Espera respuesta real
      const url = window.URL.createObjectURL(new Blob([r.data]))
      const a = document.createElement("a")
      a.href = url
      a.download = "backup.sql"
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success("Base de datos exportada correctamente")
    } catch {
      toast.error("No se pudo exportar la base de datos")
    }
  }
  /** IMPORTAR */
  const handleImport = async () => {
    if (!file) return
    const formData = new FormData()
    formData.append("backup", file)
    try {
      const r = await axios.post(route("import.db"), formData) // Espera backend
      if (!r.data?.success) throw new Error()
      toast.success("Base de datos importada correctamente")
      setFile(null)
    } catch {
      toast.error("No se pudo importar la base de datos")
    }
  }
  return (
    <AppLayout>
      <Head title="Base de Datos" />
      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall { ...{ title: "Base de datos", description: "Exportar o importar información", } } />
          {/* EXPORTAR */}
          <SmartButton { ...{ icon: Database, label: "Exportar Base de Datos", loadingLabel: "Exportando...", onClick: handleExport } } />
          {/* IMPORTAR */}
          <div className="mt-2 flex items-center gap-3">
            <input type="file" accept=".sql,.txt" className="rounded border p-2 text-sm" onChange={e => setFile(e.target.files?.[0] || null)} />
            <SmartButton
              { ...{ icon: Upload, label: "Importar Base de Datos", loadingLabel: "Importando...", variant: "secondary", disabled: !file,
                confirmation: { title: "Confirmar importación", description: "Esta acción sobrescribirá la base de datos actual.",
                }, onClick: handleImport, } } />
          </div>
        </div>
      </SettingsLayout>
    </AppLayout>
  )
}