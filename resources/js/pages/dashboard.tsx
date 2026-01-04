import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import DashboardCards from "@/components/dashboard/cards";
const breadcrumbs: BItem[] = [{ title: "Dashboard", href: "/dashboard" }];
export default function Dashboard({ menus, stats }) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
<div className="flex flex-1 flex-col p-4">
      <DashboardCards menus={menus} />
      </div>
    </AppLayout>
  );
}