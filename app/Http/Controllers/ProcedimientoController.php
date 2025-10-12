<?php
namespace App\Http\Controllers;
use App\Models\Procedimiento;
class ProcedimientoController extends BaseController
{
    public function __construct()
    {
        $this->model = Procedimiento::class;
        parent::__construct();
    }
}