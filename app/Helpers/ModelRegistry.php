<?php
namespace App\Helpers;
use App\Models as M;
class ModelRegistry
{
    public static function resolve(string $view, ?string $tipo = null)
    {
        $modelMap = [
            'cliente'   => M\Cliente::class,
            'mascota'   => M\Mascota::class,
            'cita'   => M\Cita::class,
            'historia_clinica'   => M\HistoriaClinica::class,
            'raza'   => M\Raza::class,
            'vacuna'   => M\Vacuna::class,
        ];
        if ($view === 'itemsimple') {
            $allowedTipos = ['motivo_cita', 'especie'];
            if (!$tipo || !in_array($tipo, $allowedTipos)) {
                throw new \InvalidArgumentException("Tipo 'itemsimple' no permitido o no especificado");
            }
            return M\ItemSimple::forTipo($tipo);
        }
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