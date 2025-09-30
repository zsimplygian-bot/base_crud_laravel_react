<?php

namespace App\Http\Controllers;

use App\Models\Cita;
use App\Models\CitaSeguimiento;

class CitaSeguimientoController extends BaseSeguimientoController
{
    protected string $parentModel = Cita::class;
    protected string $seguimientoModel = CitaSeguimiento::class;
    protected string $view = 'cita';
    protected string $title = 'Seguimiento';


}
