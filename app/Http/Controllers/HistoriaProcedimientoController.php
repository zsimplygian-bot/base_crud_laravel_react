<?php
namespace App\Http\Controllers;
use App\Models\HistoriaProcedimiento;
class HistoriaProcedimientoController extends BaseController {
    public function __construct() {
        $this->model = HistoriaProcedimiento::class;
        parent::__construct();
    }
}