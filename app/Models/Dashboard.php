<?php
namespace App\Models;
use Illuminate\Support\Facades\DB;
class Dashboard
{
    // Configuración de las tablas del dashboard
    protected static function getTableConfig(): array
    {
        return [
            'cliente' => [ 'label' => 'Cliente', 'icon' => 'fas fa-car', 'color' => 'bg-red-500' ],
        ];
    }
    // Devuelve los menús con totales y rutas
    public static function getMenus(): array
    {
        $config = self::getTableConfig();
        return collect($config)->map(function ($item, $key) {
            return [
                'key' => $key,
                'titulo' => $item['label'],
                'icon' => $item['icon'],
                'color' => $item['color'],
                'total' => DB::table($key)->count(),
      
            ];
        })->values()->toArray();
    }
}