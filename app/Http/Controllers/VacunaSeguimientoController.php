<?php

namespace App\Http\Controllers;

use App\Models\Vacuna;
use App\Models\VacunaSeguimiento;

class VacunaSeguimientoController extends BaseSeguimientoController
{
    protected string $parentModel = Vacuna::class;
    protected string $seguimientoModel = VacunaSeguimiento::class;
    protected string $view = 'vacuna';
    protected string $title = 'Seguimiento';


}
