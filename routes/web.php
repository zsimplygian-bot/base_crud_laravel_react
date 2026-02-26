<?php
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers as C;
use App\Http\Controllers\CitaController;
use App\Http\Controllers\DashboardController;
Route::get('/', function () { // Página principal
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/cita/{id}/notificar', [CitaController::class, 'notificar'])
        ->name('cita.notificar');
    Route::post('/cita/atender/{id}', [CitaController::class, 'atender'])
        ->name('cita.atender');
});
$resourcesWithForms = [ // Recursos principales con formularios
    'cliente'           => C\ClienteController::class,
    'user'           => C\UserController::class,
    'mascota'           => C\MascotaController::class,
    'cita'              => C\CitaController::class,
    'historia'  => C\HistoriaController::class,
    'historia_anamnesis'  => C\HistoriaAnamnesisController::class,
    'historia_seguimiento'  => C\HistoriaSeguimientoController::class,
    'historia_valoracion'  => C\HistoriaValoracionController::class,
    'historia_procedimiento'  => C\HistoriaProcedimientoController::class,
    'historia_producto'  => C\HistoriaProductoController::class,
    'historia_producto_dosis'  => C\HistoriaProductoDosisController::class,
    'categoria_producto'           => C\CategoriaProductoController::class,
    'categoria_procedimiento'           => C\CategoriaProcedimientoController::class,
    'especie'           => C\EspecieController::class,
    'raza'              => C\RazaController::class,
    'motivo'           => C\MotivoController::class,
    'producto'       => C\ProductoController::class,
    'procedimiento'     => C\ProcedimientoController::class,
];
Route::get('/calendario', function () { // Calendario de citas
    return Inertia::render('calendario/index');
});
foreach ($resourcesWithForms as $uri => $controller) { // Recursos con rutas adicionales (nested)
    Route::resource($uri, $controller)->parameters([$uri => $uri]);
    Route::get("$uri/form/{action}/{id?}", [$controller, 'handleAction'])->name("$uri.form");
    Route::post("$uri/form", [$controller, 'store'])->name("$uri.form.store");
}
Route::get('historia/pdf/{id}', [C\HistoriaController::class, 'generatePdf'])->name('historia.pdf');
require __DIR__ . '/settings.php';