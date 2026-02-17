<?php
namespace App\Helpers;
use App\Models as M;
class ModelRegistry
{
    public static function resolve(string $view, ?string $tipo = null)
    {
        $modelMap = [
            'cliente'   => M\Cliente::class,
            'user'   => M\User::class,
            'mascota'   => M\Mascota::class,
            'cita'   => M\Cita::class,
            'historia_clinica'   => M\HistoriaClinica::class,
            'categoria_producto'   => M\CategoriaProducto::class,
            'categoria_procedimiento'   => M\CategoriaProcedimiento::class,
            'especie'   => M\Especie::class,
            'raza'   => M\Raza::class,
            'motivo'   => M\Motivo::class,
            'producto'   => M\Producto::class,
            'procedimiento'   => M\Procedimiento::class,
        ];
        if (!array_key_exists($view, $modelMap)) {
            throw new \InvalidArgumentException("Vista '$view' no soportada");
        }
        $modelClass = $modelMap[$view];
        $instance = new $modelClass;
        if (!method_exists($instance, 'getQuery')) {
            throw new \InvalidArgumentException("Modelo para vista '$view' no soporta 'getQuery'");
        }
        return $instance;
    }
}