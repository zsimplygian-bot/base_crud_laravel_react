<?php
namespace App\Http\Controllers;
use App\Models\Raza;
use App\Http\Controllers\BaseController;
class RazaController extends BaseController
{
    public function __construct() {
        $this->model = Raza::class; 
        parent::__construct();
    }
}