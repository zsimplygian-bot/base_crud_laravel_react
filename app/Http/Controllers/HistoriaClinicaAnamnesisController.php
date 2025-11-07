<?php
namespace App\Http\Controllers;
use App\Models\HistoriaClinicaAnamnesis;
class HistoriaClinicaAnamnesisController extends BaseController
{
    public function __construct()
    {
        $this->model = HistoriaClinicaAnamnesis::class;
        parent::__construct();
    }
}