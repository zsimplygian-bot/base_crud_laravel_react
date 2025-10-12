<?php
namespace App\Http\Controllers;
use App\Models\Cliente;
class ClienteController extends BaseController
{
    public function __construct() {
        $this->model = Cliente::class; 
        parent::__construct();
    }
}