import { Link } from "@inertiajs/react"
import * as LucideIcons from "lucide-react"
import { Card, CardHeader, CardTitle, CardFooter, } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
export default function DashboardCards({ menus }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {menus.map((item, index) => {
        const IconComponent = LucideIcons[item.icon] || LucideIcons.Info
        return (
          <Card
            key={index}
            className="rounded-xl border shadow-sm p-4 flex flex-col gap-4"
          >
            {/* Icono + total centrados */}
            <CardHeader className="p-0 flex flex-col items-center">
              <div className="flex items-center gap-2">
                <div
                  className={`
                    p-3 rounded-full shadow-sm text-white ${item.color}
                    flex items-center justify-center
                  `}
                >
                  <IconComponent className="w-7 h-7" />
                </div>
                <CardTitle className="text-4xl font-bold">
                  {item.total}
                </CardTitle>
              </div>
              <p className="text-lg font-semibold text-center">
                {item.titulo}
              </p>
            </CardHeader>
            {/* Acciones */}
            <CardFooter className="justify-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href={item.url_create}>Crear Nuevo</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={item.url_detail}>Más detalles</Link>
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}