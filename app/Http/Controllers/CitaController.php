<?php
namespace App\Http\Controllers;
use App\Models\Cita;
use App\Models\CitaSeguimiento;
use App\Http\Controllers\BaseController;
class CitaController extends BaseController
{
    public function __construct() {
        $this->model = Cita::class; 
        parent::__construct();
    }
    protected function extraFormData($record, string $action): array
    {
        return [
            'modalFields'  => CitaSeguimiento::getModalFields(),
            'seguimientos' => $record ? $record->cita_seguimientos()->orderBy('fecha', 'desc')->get() : [],
        ];
    }
}