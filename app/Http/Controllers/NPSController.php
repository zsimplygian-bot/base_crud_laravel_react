<?php
namespace App\Http\Controllers;
use App\Models\NPS;
class NPSController extends BaseController
{
    public function __construct()
    {
        $this->model = NPS::class;
        parent::__construct();
    }
}