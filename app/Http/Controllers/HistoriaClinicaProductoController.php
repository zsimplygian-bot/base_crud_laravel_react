<?php
namespace App\Http\Controllers;
use App\Models\HistoriaClinicaProducto;
class HistoriaClinicaProductoController extends BaseController
{
    public function __construct()
    {
        $this->model = HistoriaClinicaProducto::class;
        parent::__construct();
    }
}
