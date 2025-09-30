<?php
namespace App\Http\Controllers;
use App\Models\HistoriaClinica;
use App\Models\HistoriaClinicaSeguimiento;
class HistoriaClinicaController extends BaseController
{
    public function __construct()
    {
        $this->model = HistoriaClinica::class;
        parent::__construct();
    }
    protected function extraFormData($record, string $action): array
    {
        return [
            'modalFields'  => HistoriaClinicaSeguimiento::getModalFields(),
            'seguimientos' => $record ? $record->historia_seguimientos()->orderBy('fecha', 'desc')->get() : [],
        ];
    }
}