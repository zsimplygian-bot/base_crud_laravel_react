<?php
namespace App\Http\Controllers;
use App\Models\HistoriaSeguimiento;
class HistoriaSeguimientoController extends BaseController {
    public function __construct() {
        $this->model = HistoriaSeguimiento::class;
        parent::__construct();
    }
}