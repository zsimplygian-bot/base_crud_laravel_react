import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

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
  color: string;
  url_create: string;
  url_detail: string;
};

// Props del dashboard
type DashboardProps = {
  menus: MenuItem[];
  stats: {
    razas: { raza: string; total: number }[];
    citasPorMes: { mes: string; total: number }[];
  };
};

export default function Dashboard({ menus, stats }: DashboardProps) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="flex flex-1 flex-col gap-6 p-4">
        {/* Grid con cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
  {menus.map(({ key, titulo, total, url_create, url_detail, color, icon }, index) => (
    <div
      key={index}
      className={`flex flex-col items-center justify-center rounded-xl border p-4 shadow-lg
        bg-white text-gray-900 border-gray-300
        dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700`}
    >
      {/* Color dinámico + icono + número */}
      <div className={`w-full rounded-xl p-4 text-white ${color || 'bg-gray-500'}`}>
        <div className="flex items-center justify-center gap-3">
          {icon && <i className={`${icon} text-4xl`}></i>}
          <h3 className="text-3xl font-semibold">{total}</h3>
        </div>
        <p className="mt-2 text-center text-lg font-medium">{titulo}</p>
      </div>

      {/* Enlaces de acción */}
      <div className="mt-4 flex justify-center">
        <Link
          href={url_create}
          className="text-sm text-gray-700 hover:underline dark:text-gray-200"
        >
          Crear Nuevo
        </Link>
      </div>
      <div className="mt-2 text-center">
        <Link
          href={url_detail}
          className="text-sm text-gray-600 hover:underline dark:text-gray-400"
        >
          Más detalles <i className="fas fa-arrow-circle-right"></i>
        </Link>
      </div>
    </div>
  ))}
</div>

{/* Gráfico con Recharts - Totales */}
<div className="rounded-xl border p-4 shadow-lg bg-white text-gray-900 border-gray-300 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700">
  <h2 className="mb-4 text-xl font-semibold">Estadísticas generales</h2>
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={menus}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="titulo" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="total" fill="#4F46E5" radius={[8, 8, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
</div>

{/* Gráfico de razas más comunes */}
<div className="rounded-xl border p-4 shadow-lg bg-white text-gray-900 border-gray-300 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700">
  <h2 className="mb-4 text-xl font-semibold">Razas más comunes</h2>
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={stats.razas}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="raza" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="total" fill="#10B981" radius={[8, 8, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
</div>

{/* Gráfico de citas por mes */}
<div className="rounded-xl border p-4 shadow-lg bg-white text-gray-900 border-gray-300 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700">
  <h2 className="mb-4 text-xl font-semibold">Citas por mes</h2>
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={stats.citasPorMes}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="mes" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="total" fill="#F59E0B" radius={[8, 8, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
</div>

      </div>
    </AppLayout>
  );
}
