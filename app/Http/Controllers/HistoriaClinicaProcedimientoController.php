<?php
namespace App\Http\Controllers;
use App\Models\HistoriaClinicaProcedimiento;
class HistoriaClinicaProcedimientoController extends BaseController
{
    public function __construct()
    {
        $this->model = HistoriaClinicaProcedimiento::class;
        parent::__construct();
    }
}