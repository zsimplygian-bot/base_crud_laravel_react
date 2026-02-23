import * as LucideIcons from "lucide-react"
import { List } from "lucide-react"
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { SmartButton } from "@/components/smart-button"
import { NewRecordButton } from "@/components/datatable/toolbar/new-record-button"
import { FORM_CONFIG } from "@/config/forms"
export default function DashboardCards({ menus }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {menus.map((item, index) => {
        const form = FORM_CONFIG[item.view] // Resolución por view
        const IconComponent = form?.icon
          ?? LucideIcons[item.icon]
          ?? LucideIcons.Info
        return (
          <Card key={index} { ... { className: "rounded-xl border shadow-sm p-4 flex flex-col gap-4" } } >
            <CardHeader { ... { className: "p-0 flex flex-col items-center" } } >
              <div className="flex items-center gap-2">
                <div { ... {
                    className: `p-3 rounded-full shadow-sm text-white ${item.color} flex items-center justify-center` } } >
                  <IconComponent className="w-7 h-7" />
                </div>
                <CardTitle { ... { className: "text-4xl font-bold" } } > {item.total} </CardTitle>
              </div>
              <p { ... { className: "text-sm text-muted-foreground text-center" } } > {form?.title ?? item.label}</p>
            </CardHeader>
            <CardFooter { ... { className: "justify-center gap-2 flex-wrap" } }
            >
              {form && ( <NewRecordButton { ... { view: form.view, title: form.title, fields: form.fields, } } /> )}
              <SmartButton { ... { to: `/${item.view}`, tooltip: "Ver listado", icon: List, variant: "outline", } } />
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}