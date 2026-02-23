<?php
namespace App\Http\Controllers;
use App\Models\HistoriaProductoDosis;
class HistoriaProductoDosisController extends BaseController
{
    public function __construct()
    {
        $this->model = HistoriaProductoDosis::class;
        parent::__construct();
    }
}
