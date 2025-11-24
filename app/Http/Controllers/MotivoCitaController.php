<?php
namespace App\Http\Controllers;
use App\Models\MotivoCita;
class MotivoCitaController extends BaseController
{
    public function __construct() {
        $this->model = MotivoCita::class; 
        parent::__construct();
    }
}