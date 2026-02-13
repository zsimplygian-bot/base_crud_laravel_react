<?php
namespace App\Http\Controllers;
use App\Models\Categoria;
use App\Http\Controllers\BaseController;
class CategoriaController extends BaseController
{
    public function __construct() {
        $this->model = Categoria::class; 
        parent::__construct();
    }
}