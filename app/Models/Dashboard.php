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
                'label' => 'Cliente',
                'icon'  => 'fas fa-user',
                'color' => 'bg-red-500',
            ],
            'mascota' => [
                'label' => 'Mascota',
                'icon'  => 'fas fa-dog',
                'color' => 'bg-green-500',
            ],
            'cita' => [
                'label' => 'Cita',
                'icon'  => 'fas fa-calendar',
                'color' => 'bg-blue-500',
            ],
            'historia_clinica' => [
                'label' => 'Historias Clínicas',
                'icon'  => 'fas fa-notes-medical',
                'color' => 'bg-yellow-500',
            ],
            'vacuna' => [
                'label' => 'Vacuna',
                'icon'  => 'fas fa-syringe',
                'color' => 'bg-purple-500',
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
