<?php
namespace App\Http\Controllers;

use App\Models\HistoriaClinica;
use App\Models\HistoriaClinicaProcedimiento;

class HistoriaClinicaProcedimientoController extends BaseSeguimientoController
{
    protected string $parentModel = HistoriaClinica::class;
    protected string $seguimientoModel = HistoriaClinicaProcedimiento::class;
    protected string $view = 'historia_clinica';
    protected string $title = 'Procedimiento';
}
