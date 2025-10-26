<?php
namespace App\Models;
use Illuminate\Support\Facades\DB;
class Dashboard
{
    // Configuración de las tablas del dashboard
    protected static function getTableConfig(): array
    {
        return [
            'cliente' => [
                'label' => 'Dueños',
                'icon'  => 'Users',
                'color' => 'bg-red-500',
            ],
            'mascota' => [
                'label' => 'Mascotas',
                'icon'  => 'PawPrint',
                'color' => 'bg-green-500',
            ],
            'cita' => [
                'label' => 'Citas',
                'icon'  => 'Calendar',
                'color' => 'bg-blue-500',
            ],
            'historia_clinica' => [
                'label' => 'Historias clínicas',
                'icon'  => 'Stethoscope',
                'color' => 'bg-yellow-500',
            ],
        ];
    }


    // Devuelve los menús con totales y rutas personalizadas
    public static function getMenus(): array
    {
        $config = self::getTableConfig();
        return collect($config)->map(function ($item, $key) {
            return [
                'key'        => $key,
                'titulo'     => $item['label'],
                'icon'       => $item['icon'],
                'color'      => $item['color'],
                'total'      => DB::table($key)->count(),
                'url_create' => url($key . '/form/create'),
                'url_detail' => url($key),
            ];
        })->values()->toArray();
    }

    // 🔹 Datos extra para gráficos
    public static function getStats(): array
    {
        // Top 5 razas más comunes
        $razas = DB::table('mascota')
            ->join('raza', 'mascota.id_raza', '=', 'raza.id_raza')
            ->select('raza', DB::raw('COUNT(*) as total'))
            ->groupBy('raza')
            ->orderByDesc('total')
            ->limit(5)
            ->get();

        // Citas por mes (últimos 6 meses)
        $citasPorMes = DB::table('cita')
            ->selectRaw("DATE_FORMAT(fecha, '%Y-%m') as mes, COUNT(*) as total")
            ->groupBy('mes')
            ->orderBy('mes', 'desc')
            ->limit(6)
            ->get()
            ->reverse() // para que se muestre de más antiguo a reciente
            ->values();

        return [
            'razas' => $razas,
            'citasPorMes' => $citasPorMes,
        ];
    }
}
