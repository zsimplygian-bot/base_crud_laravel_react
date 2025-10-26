<?php
namespace App\Http\Controllers;
use App\Models\Especie;
use App\Http\Controllers\BaseController;
class EspecieController extends BaseController
{
    public function __construct() {
        $this->model = Especie::class; 
        parent::__construct();
    }
}