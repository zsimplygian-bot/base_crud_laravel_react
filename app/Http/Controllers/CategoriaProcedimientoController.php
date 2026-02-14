<?php
namespace App\Http\Controllers;
use App\Models\CategoriaProcedimiento;
use App\Http\Controllers\BaseController;
class CategoriaProcedimientoController extends BaseController
{
    public function __construct() {
        $this->model = CategoriaProcedimiento::class; 
        parent::__construct();
    }
}