<?php
namespace App\Http\Controllers;
use App\Models\Producto;
class ProductoController extends BaseController
{
    public function __construct()
    {
        $this->model = Producto::class;
        parent::__construct();
    }
}