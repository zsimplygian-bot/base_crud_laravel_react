<?php
namespace App\Http\Controllers;
use App\Models\Medicamento;
class MedicamentoController extends BaseController
{
    public function __construct()
    {
        $this->model = Medicamento::class;
        parent::__construct();
    }
}