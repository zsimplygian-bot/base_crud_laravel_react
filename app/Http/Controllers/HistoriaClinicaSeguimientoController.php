<?php
namespace App\Http\Controllers;
use App\Models\HistoriaClinicaSeguimiento;
class HistoriaClinicaSeguimientoController extends BaseController
{
    public function __construct()
    {
        $this->model = HistoriaClinicaSeguimiento::class;
        parent::__construct();
    }
}