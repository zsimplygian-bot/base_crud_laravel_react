<?php
namespace App\Http\Controllers;
use App\Models\Miembro;
use App\Http\Controllers\BaseController;
class MiembroController extends BaseController
{
    public function __construct() {
        $this->model = Miembro::class; 
        parent::__construct();
    }
}