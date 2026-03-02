import { Head } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import DashboardCards from "@/components/dashboard/cards"
import DashboardCharts from "@/components/dashboard/charts"
const breadcrumbs = [{ title: "Dashboard", href: "/dashboard" }]
export default function Dashboard({ menus }) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="flex flex-col gap-4 p-4">
        <DashboardCards menus={menus} />
        <DashboardCharts menus={menus} />
      </div>
    </AppLayout>
  )
}