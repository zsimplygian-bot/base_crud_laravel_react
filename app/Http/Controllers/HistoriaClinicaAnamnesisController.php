<?php

namespace App\Http\Controllers;

use App\Models\HistoriaClinica;
use App\Models\HistoriaClinicaAnamnesis;

class HistoriaClinicaAnamnesisController extends BaseSeguimientoController
{
    protected string $parentModel = HistoriaClinica::class;
    protected string $seguimientoModel = HistoriaClinicaAnamnesis::class;
    protected string $view = 'historia_clinica';
    protected string $title = 'Anamnesis';
}
