<?php
namespace App\Http\Controllers;
use App\Models\HistoriaClinicaMedicamento;
class HistoriaClinicaMedicamentoController extends BaseController
{
    public function __construct()
    {
        $this->model = HistoriaClinicaMedicamento::class;
        parent::__construct();
    }
}
