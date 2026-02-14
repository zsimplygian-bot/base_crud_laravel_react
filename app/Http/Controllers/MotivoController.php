<?php
namespace App\Http\Controllers;
use App\Models\Motivo;
class MotivoController extends BaseController
{
    public function __construct() {
        $this->model = Motivo::class; 
        parent::__construct();
    }
}