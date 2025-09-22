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
            'consulta' => [
                'label' => 'Consulta',
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
                // Ajuste de rutas según tu convención
                'url_create' => url($key . '/form/create'),
                'url_detail' => url($key), 
            ];
        })->values()->toArray();
    }
}
