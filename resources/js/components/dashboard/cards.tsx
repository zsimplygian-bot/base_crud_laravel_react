import * as LucideIcons from "lucide-react"
import { List, ChevronDown, ChevronUp } from "lucide-react"
import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { SmartButton } from "@/components/smart-button"
import { NewRecordButton } from "@/components/datatable/toolbar/new-record-button"
import { FORM_CONFIG } from "@/config/forms"
const CARD_STYLES = {
  primary: { card: "rounded-xl border shadow-sm p-4", iconWrap: "p-3", icon: "w-7 h-7", title: "text-4xl font-bold", buttonSize: "default" },
  secondary: { card: "rounded-lg border shadow-sm p-3", iconWrap: "p-2", icon: "w-5 h-5", title: "text-3xl font-bold", buttonSize: "sm" },
}
const STORAGE_KEY = "dashboard_show_secondary"
export default function DashboardCards({ menus }) {
  const [showSecondary, setShowSecondary] = useState(true)
  useEffect(() => { const stored = localStorage.getItem(STORAGE_KEY); if (stored !== null) setShowSecondary(stored === "true") }, [])
  useEffect(() => { localStorage.setItem(STORAGE_KEY, String(showSecondary)) }, [showSecondary])
  const [primary, secondary] = [menus.slice(0, 4), menus.slice(4)]
  const renderCard = (item, variant, i) => {
    const form = FORM_CONFIG[item.view]
    const styles = CARD_STYLES[variant]
    const Icon = form?.icon ?? LucideIcons[item.icon] ?? LucideIcons.Info
    return (
      <Card key={`${variant}-${i}`} className={styles.card}>
        <div className="flex justify-between gap-4">
          <CardHeader className="p-0 flex flex-col items-center flex-1 text-center">
            <div className="flex items-center gap-2">
              <div className={`${styles.iconWrap} rounded-full text-white ${item.color}`}><Icon className={styles.icon} /></div>
              <CardTitle className={styles.title}>{item.total}</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{form?.title ?? item.label}</p>
          </CardHeader>
          <div className="flex flex-col gap-2">
            {form && <NewRecordButton {...{ view: form.view, title: form.title, fields: form.fields, size: styles.buttonSize }} />}
            <SmartButton {...{ to: `/${item.view}`, icons: List, variant: "outline", size: styles.buttonSize }} />
          </div>
        </div>
      </Card>
    )
  }
  return (
    <div className="space-y-3">
      {secondary.length > 0 && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold">REGISTROS ACTUALES</span>
          <SmartButton {...{ onClick: () => setShowSecondary(v => !v), icons: showSecondary ? ChevronUp : ChevronDown, variant: "outline", size: "sm" }} />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">{primary.map((item, i) => renderCard(item, "primary", i))}</div>
      {showSecondary && <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">{secondary.map((item, i) => renderCard(item, "secondary", i))}</div>}
    </div>
  )
}