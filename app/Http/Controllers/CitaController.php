<?php
namespace App\Http\Controllers;
use App\Models\Cita;
use App\Models\CitaSeguimiento;
use App\Http\Controllers\BaseController;
class CitaController extends BaseController
{
    public function __construct() {
        $this->model = Cita::class; 
        parent::__construct();
    }

}