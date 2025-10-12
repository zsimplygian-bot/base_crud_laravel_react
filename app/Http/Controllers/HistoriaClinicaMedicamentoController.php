<?php
namespace App\Http\Controllers;

use App\Models\HistoriaClinica;
use App\Models\HistoriaClinicaMedicamento;

class HistoriaClinicaMedicamentoController extends BaseSeguimientoController
{
    protected string $parentModel = HistoriaClinica::class;
    protected string $seguimientoModel = HistoriaClinicaMedicamento::class;
    protected string $view = 'historia_clinica';
    protected string $title = 'Medicamento';
}
