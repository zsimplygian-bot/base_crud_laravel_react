<?php

namespace App\Http\Controllers;

use App\Models\Cita;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;

class CitaController extends BaseController
{
    public function __construct()
    {
        $this->model = Cita::class;
        parent::__construct();
    }

    protected function validateExtra(Request $request, $id = null)
    {
        if (($request->id_estado_cita ?? null) != 1) return;
        if (!$request->fecha || !$request->hora) return;

        $fechaHora = Carbon::parse("{$request->fecha} {$request->hora}");

        if ($fechaHora->lessThan(now()->addHour())) {
            throw ValidationException::withMessages([
                'hora' => 'La hora debe ser mínimo una hora después de la actual.',
            ]);
        }
    }

    public function proximas()
    {
        return response()->json(Cita::proximas());
    }

    public function atender($id)
    {
        Cita::where('id_cita', $id)->update(['id_estado_cita' => 2]);

        return response()->json([
            'success' => true,
            'id_estado_cita' => 2,
        ]);
    }

    public function cancelar($id)
    {
        Cita::where('id_cita', $id)->update(['id_estado_cita' => 3]);

        return response()->json([
            'success' => true,
            'id_estado_cita' => 3,
        ]);
    }

    public function eventos(Request $request)
    {
        $start = $request->query('start');
        $end   = $request->query('end');

        if (!$start || !$end) return response()->json([]);

        return response()->json(
            Cita::eventosEntreFechas($start, $end)
                ->map(fn($c) => [
                    'id' => $c->id,
                    'start' => $c->start,
                    'mascota' => $c->mascota,
                    'cliente' => $c->cliente,
                    'motivo' => $c->motivo,
                    'fecha' => $c->fecha,
                    'fecha_hora_notificacion' => $c->fecha_hora_notificacion,
                    'id_estado_cita' => $c->id_estado_cita,
                ])
        );
    }

    public function notificar($id)
    {
        $cita = Cita::findOrFail($id);
        $cita->fecha_hora_notificacion = now();
        $cita->save();

        return response()->json([
            'success' => true,
            'message' => 'Notificación registrada',
            'fecha_notificacion' => $cita->fecha_hora_notificacion->format('d/m/Y H:i:s'),
        ]);
    }
}