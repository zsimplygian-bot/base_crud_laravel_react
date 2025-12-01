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
    public function atender($id)
    {
        $cita = Cita::findOrFail($id);
        $cita->update([
            'id_estado_cita' => 2,
        ]);
        return redirect()->to('/historia_clinica/form/create');
    }
    public function eventos(Request $request)
    {
        $start = $request->query('start');
        $end   = $request->query('end');

        if (!$start || !$end) {
            return response()->json([]);
        }

        $citas = Cita::eventosEntreFechas($start, $end);

        return response()->json(
            $citas->map(fn($item) => [
                'id'      => $item->id,
                'start'   => $item->start,
                'mascota' => $item->mascota,
                'cliente' => $item->cliente,
                'motivo'  => $item->motivo_cita,
                'fecha'  => $item->fecha,
                'hora'  => $item->hora,
                'id_estado_cita' => $item->id_estado_cita,
            ])
        );
    }


    public function info($id)
    {
        $t1 = (new Cita)->getTable();
        $t2 = 'mascota';
        $t3 = 'cliente';
        $t4 = 'motivo_cita';
        $t5 = 'estado_cita';

        $cita = DB::table($t1)
            ->leftJoin($t2, "$t1.id_$t2", '=', "$t2.id_$t2")
            ->leftJoin($t3, "$t2.id_$t3", '=', "$t3.id_$t3")
            ->leftJoin($t4, "$t1.id_$t4", '=', "$t4.id_$t4")
            ->leftJoin($t5, "$t1.id_$t5", '=', "$t5.id_$t5")
            ->where("$t1.id_$t1", $id)
            ->select([
                "$t1.id_$t1 as id",
                "$t2.mascota",
                "$t3.cliente",
                "$t3.telefono",
                "$t1.fecha",
                "$t1.hora",
                "$t1.fecha_hora_atencion",
                "$t1.fecha_hora_notificacion",
                "$t4.motivo_cita",
                "$t5.estado_cita as estado",
                "$t1.observaciones"
            ])
            ->first();

        if (!$cita) {
            return response()->json(null, 404);
        }

        return response()->json($cita);
    }
public function notificar($id)
{

    // Buscamos la cita
    $cita = Cita::findOrFail($id);

    // FORZAMOS el guardado directo del campo (ignora $fillable)
    $cita->fecha_hora_notificacion = now();

    // Guardamos SOLO este campo (bypassea mass assignment)
    $cita->save();


    return response()->json([
        'success' => true,
        'message' => 'Notificación registrada',
        'fecha_notificacion' => $cita->fecha_hora_notificacion->format('d/m/Y H:i:s'),
    ]);
}


}