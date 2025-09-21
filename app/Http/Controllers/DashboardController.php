<?php
namespace App\Http\Controllers;
use App\Models\Dashboard;
use Inertia\Inertia;
class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('dashboard', [
            'menus' => Dashboard::getMenus(),
        ]);
    }
}