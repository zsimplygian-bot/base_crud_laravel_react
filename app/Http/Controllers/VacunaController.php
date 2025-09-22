<?php
namespace App\Http\Controllers;
use App\Models\Vacuna;
use App\Http\Controllers\BaseController;
class VacunaController extends BaseController
{
    public function __construct() {
        $this->model = Vacuna::class; 
        parent::__construct();
    }
}