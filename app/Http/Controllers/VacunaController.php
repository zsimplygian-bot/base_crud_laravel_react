<?php
namespace App\Http\Controllers;
use App\Models\Vacuna;
use App\Models\VacunaSeguimiento;
use App\Http\Controllers\BaseController;
class VacunaController extends BaseController
{
    public function __construct() {
        $this->model = Vacuna::class; 
        parent::__construct();
    }
    protected function extraFormData($record, string $action): array
    {
        return [
            'modalFields'  => VacunaSeguimiento::getModalFields(),
            'seguimientos' => $record ? $record->vacuna_seguimientos()->orderBy('fecha', 'desc')->get() : [],
        ];
    }
}