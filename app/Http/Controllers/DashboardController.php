<?php
namespace App\Http\Controllers;

use App\Models\Dashboard;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('dashboard', [ // 👈 ojo, la "D" debe coincidir con tu componente en React
            'menus' => Dashboard::getMenus(), // 👈 nuevo bloque para las gráficas
        ]);
    }
}
