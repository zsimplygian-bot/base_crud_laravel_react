<?php
namespace App\Http\Controllers;
use App\Models\Churn;
class ChurnController extends BaseController
{
    public function __construct()
    {
        $this->model = Churn::class;
        parent::__construct();
    }
}