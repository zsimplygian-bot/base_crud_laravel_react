<?php
namespace App\Http\Controllers;
use App\Models\MotivoHistoriaClinica;
class MotivoHistoriaClinicaController extends BaseController
{
    public function __construct() {
        $this->model = MotivoHistoriaClinica::class; 
        parent::__construct();
    }
}