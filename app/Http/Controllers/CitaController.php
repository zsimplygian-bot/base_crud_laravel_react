<?php
namespace App\Http\Controllers;
use App\Models\Cita;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;
class CitaController extends BaseController
{
    public function __construct() {
        $this->model = Cita::class;
        parent::__construct();
    }
    protected function validateExtra(Request $request, $id = null)
    {
        // Solo validar hora si id_estado_cita es 1
        if (($request->id_estado_cita ?? null) == 1) {
            if (!$request->fecha || !$request->hora) return;
            $fechaHora = Carbon::parse("{$request->fecha} {$request->hora}");
            $minima = Carbon::now()->addHour();
            if ($fechaHora->lessThan($minima)) {
                throw ValidationException::withMessages([
                    'hora' => 'La hora debe ser mínimo una hora después de la actual.'
                ]);
            }
        }
    }
    // Endpoint para próximas citas
    public function proximas()
    {
        $citas = Cita::proximas();
        return response()->json($citas);
    }
    public function eventos(Request $request)
    {
        $start = $request->query('start');
        $end   = $request->query('end');
        if (!$start || !$end) {
            return response()->json([]); // evitar consulta sin rango
        }
        $citas = Cita::select(
            'cita.id_cita as id',
            'mascota.mascota',
            'cliente.cliente',
            'motivo_cita.motivo_cita',
            DB::raw("CONCAT(cita.fecha, 'T', cita.hora) as start")
        )
        ->join('mascota', 'cita.id_mascota', '=', 'mascota.id_mascota')
        ->join('cliente', 'mascota.id_cliente', '=', 'cliente.id_cliente')
        ->join('motivo_cita', 'cita.id_motivo_cita', '=', 'motivo_cita.id_motivo_cita')
        ->whereBetween('cita.fecha', [$start, $end])
        ->get();
        return response()->json(
            $citas->map(function ($item) {
                return [
                    'id'    => $item->id,
                    'title' => $item->mascota . ' – ' . $item->motivo_cita,
                    'start' => $item->start,
                ];
            })
        );
    }
}