<?php
namespace App\Http\Controllers;
use App\Models\CategoriaProducto;
use App\Http\Controllers\BaseController;
class CategoriaProductoController extends BaseController
{
    public function __construct() {
        $this->model = CategoriaProducto::class; 
        parent::__construct();
    }
}