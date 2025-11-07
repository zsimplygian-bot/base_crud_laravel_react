import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/button";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Dashboard", href: "/dashboard" },
];

type MenuItem = {
  key: string;
  titulo: string;
  total: number;
  icon?: string;
  color: string;
  url_create: string;
  url_detail: string;
};

type DashboardProps = {
  menus: MenuItem[];
  stats: {
    razas: { raza: string; total: number }[];
    citasPorMes: { mes: string; total: number }[];
  };
};

export default function Dashboard({ menus, stats }: DashboardProps) {
  const DatabaseIcon = LucideIcons.Database;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="flex flex-1 flex-col gap-6 p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {menus.map(({ key, titulo, total, url_create, url_detail, color, icon }, index) => {
            const IconComponent = LucideIcons[icon as keyof typeof LucideIcons] || LucideIcons.Info;
            return (
              <div
                key={index}
                className="flex flex-col items-center justify-center rounded-xl border p-4 shadow-lg"
              >
                <div className={`w-full rounded-xl p-4 text-white ${color}`}>
                  <div className="flex items-center justify-center gap-3">
                    <IconComponent className="w-8 h-8" />
                    <h3 className="text-3xl font-semibold">{total}</h3>
                  </div>
                  <p className="mt-2 text-center text-lg font-medium">{titulo}</p>
                </div>
                <div className="mt-4 flex justify-center gap-2">
                  <Link
                    href={url_create}
                    className="text-sm text-gray-700 hover:underline dark:text-gray-200"
                  >
                    Crear Nuevo
                  </Link>
                  <Link
                    href={url_detail}
                    className="text-sm text-gray-600 hover:underline dark:text-gray-400"
                  >
                    Más detalles →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Botón elegante de exportar */}
        <div className="flex justify-end mt-0">
          <Button
            variant="default"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => window.location.href = route('export.db')}
          >
            <DatabaseIcon className="w-4 h-4" />
            Exportar Base de Datos
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
