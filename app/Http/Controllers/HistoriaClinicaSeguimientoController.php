<?php

namespace App\Http\Controllers;

use App\Models\HistoriaClinica;
use App\Models\HistoriaClinicaSeguimiento;

class HistoriaClinicaSeguimientoController extends BaseSeguimientoController
{
    protected string $parentModel = HistoriaClinica::class;
    protected string $seguimientoModel = HistoriaClinicaSeguimiento::class;
    protected string $view = 'historia_clinica';
    protected string $title = 'Seguimiento';


}
