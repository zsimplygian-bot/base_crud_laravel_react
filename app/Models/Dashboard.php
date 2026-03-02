<?php
namespace App\Models;

use Illuminate\Support\Facades\DB;

class Dashboard {
    public static function getConfig(): array {
        return [
            [ 'view' => 'cliente', 'label' => 'Dueños', 'icon' => 'Users', 'color' => 'bg-red-500',
              'total' => DB::table('cliente')->count(), ],

            [ 'view' => 'mascota', 'label' => 'Mascotas', 'icon' => 'PawPrint', 'color' => 'bg-green-500',
              'total' => DB::table('mascota')->count(), ],

            [ 'view' => 'cita', 'label' => 'Citas', 'icon' => 'Calendar', 'color' => 'bg-blue-500',
              'total' => DB::table('cita')->count(), ],

            [ 'view' => 'historia', 'label' => 'Historias clínicas', 'icon' => 'Stethoscope', 'color' => 'bg-yellow-500',
              'total' => DB::table('historia')->count(), ],

            [ 'view' => 'producto', 'label' => 'Productos', 'icon' => 'Package', 'color' => 'bg-purple-500',
              'total' => DB::table('producto')->count(), ],

            [ 'view' => 'procedimiento', 'label' => 'Procedimientos', 'icon' => 'Activity', 'color' => 'bg-indigo-500',
              'total' => DB::table('procedimiento')->count(), ],

            [ 'view' => 'categoria_producto', 'label' => 'Categorías de productos', 'icon' => 'Tags', 'color' => 'bg-pink-500',
              'total' => DB::table('categoria_producto')->count(), ],

            [ 'view' => 'categoria_procedimiento', 'label' => 'Categorías de procedimientos', 'icon' => 'Layers', 'color' => 'bg-teal-500',
              'total' => DB::table('categoria_procedimiento')->count(), ],

            [ 'view' => 'especie', 'label' => 'Especies', 'icon' => 'Fish', 'color' => 'bg-orange-500',
              'total' => DB::table('especie')->count(), ],

            [ 'view' => 'raza', 'label' => 'Razas', 'icon' => 'GitBranch', 'color' => 'bg-cyan-500',
              'total' => DB::table('raza')->count(), ],

            [ 'view' => 'motivo', 'label' => 'Motivos', 'icon' => 'HelpCircle', 'color' => 'bg-lime-500',
              'total' => DB::table('motivo')->count(), ],
        ];
    }
}