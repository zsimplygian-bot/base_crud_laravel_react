import { Head } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { type BreadcrumbItem } from "@/types"
import DashboardCards from "@/components/dashboard/cards"
import DashboardCharts from "@/components/dashboard/charts"
const breadcrumbs: BreadcrumbItem[] = [
  { title: "Dashboard", href: "/dashboard" },
]
export default function Dashboard({ menus, stats }: DashboardProps) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="flex flex-1 flex-col p-4">
        <DashboardCards menus={menus} />
        <DashboardCharts stats={stats} />
      </div>
    </AppLayout>
  )
}