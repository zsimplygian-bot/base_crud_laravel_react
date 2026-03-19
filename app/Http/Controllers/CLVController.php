<?php
namespace App\Http\Controllers;
use App\Models\CLV;
class CLVController extends BaseController
{
    public function __construct()
    {
        $this->model = CLV::class;
        parent::__construct();
    }
}