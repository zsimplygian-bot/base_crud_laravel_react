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
            'categoria'   => M\Categoria::class,
            'especie'   => M\Especie::class,
            'raza'   => M\Raza::class,
            'motivo_cita'   => M\MotivoCita::class,
            'motivo_historia_clinica'   => M\MotivoHistoriaClinica::class,
            'medicamento'   => M\Medicamento::class,
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