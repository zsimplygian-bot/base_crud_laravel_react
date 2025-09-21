<?php
namespace App\Http\Controllers;
use App\Models\Consulta;
use App\Http\Controllers\BaseController;
class ConsultaController extends BaseController
{
    public function __construct() {
        $this->model = Consulta::class; 
        parent::__construct();
    }
}