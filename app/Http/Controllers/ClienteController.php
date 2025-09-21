<?php
namespace App\Http\Controllers;
use App\Models\Cliente;
use App\Http\Controllers\BaseController;
class ClienteController extends BaseController
{
    public function __construct() {
        $this->model = Cliente::class; 
        parent::__construct();
    }
}