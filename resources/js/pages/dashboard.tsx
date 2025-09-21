import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
// Breadcrumbs para navegación
const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
];
// Tipo para cada ítem del dashboard
type MenuItem = {
  key: string;
  titulo: string;
  total: number;
  icon?: string;
  color: string; // <- ahora viene desde el backend
  url_create: string;
  url_detail: string;
};
export default function Dashboard({ menus }: { menus: MenuItem[] }) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {menus.map(({ key, titulo, total, url_create, url_detail, color }, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center rounded-xl border border-gray-300 p-4 shadow-lg dark:border-gray-700"
            >
              {/* Se aplica el color dinámicamente desde el backend */}
              <div className={`w-full rounded-xl p-4 text-white ${color || 'bg-gray-500'}`}>
                <div className="flex flex-col items-center justify-center">
                  <h3 className="text-3xl font-semibold">{total}</h3>
                  <p className="mt-2 text-lg font-medium">{titulo}</p>
                </div>
              </div>
              {/* Enlaces de acción */}
              <div className="mt-4 flex justify-center">
                <a
                  href={url_create}
                  className="text-sm text-gray-700 hover:underline dark:text-gray-200"
                >
                  Crear Nuevo
                </a>
              </div>
              <div className="mt-2 text-center">
                <a
                  href={url_detail}
                  className="text-sm text-gray-600 hover:underline dark:text-gray-400"
                >
                  Más detalles <i className="fas fa-arrow-circle-right"></i>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}