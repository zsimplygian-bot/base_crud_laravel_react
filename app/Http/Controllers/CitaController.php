<?php
namespace App\Http\Controllers;

use App\Models\Cita;

class CitaController extends BaseController
{
    public function __construct() {
        $this->model = Cita::class;
        parent::__construct();
    }

    // Endpoint para próximas citas
    public function proximas()
    {
        $citas = Cita::proximas();
        return response()->json($citas);
    }
}
