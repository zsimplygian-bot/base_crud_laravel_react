<?php
namespace App\Http\Controllers;
use App\Models\Mascota;
use App\Http\Controllers\BaseController;
class MascotaController extends BaseController
{
    public function __construct() {
        $this->model = Mascota::class; 
        parent::__construct();
    }
}