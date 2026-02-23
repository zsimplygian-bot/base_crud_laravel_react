<?php
namespace App\Models;
use Illuminate\Support\Facades\DB;
class Dashboard {
    public static function getConfig(): array {
        return [ 
            [ 'view'  => 'cliente', 'label' => 'Dueños', 'icon'  => 'Users', 'color' => 'bg-red-500', 
                'total'  => DB::table('cliente')->count(), ],
            [ 'view'  => 'mascota', 'label' => 'Mascotas', 'icon'  => 'PawPrint', 'color' => 'bg-green-500', 
                'total'  => DB::table('mascota')->count(), ],
            [ 'view'  => 'cita', 'label' => 'Citas', 'icon'  => 'Calendar', 'color' => 'bg-blue-500', 
                'total'  => DB::table('cita')->count(), ],
            [ 'view'  => 'historia', 'label' => 'Historias clínicas', 'icon'  => 'Stethoscope', 'color' => 'bg-yellow-500', 
                'total'  => DB::table('historia')->count(),  ],
        ];
    }
}