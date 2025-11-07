<?php
namespace App\Http\Controllers;
use App\Models\Cita;
use Illuminate\Http\Request;
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
}