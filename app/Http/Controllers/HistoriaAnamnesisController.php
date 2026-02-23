<?php
namespace App\Http\Controllers;
use App\Models\HistoriaAnamnesis;
class HistoriaAnamnesisController extends BaseController {
    public function __construct() {
        $this->model = HistoriaAnamnesis::class;
        parent::__construct();
    }
}