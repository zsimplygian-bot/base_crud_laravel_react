<?php
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers as C;

// Página principal
Route::get('/', fn () => Inertia::render('welcome'))->name('home');

// Dashboard
Route::get('/dashboard', [C\DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

// Recursos con formularios personalizados
$resourcesWithForms = [
    'cliente' => C\ClienteController::class,
    'mascota' => C\MascotaController::class,
    'cita' => C\CitaController::class,
    'historia_clinica' => C\HistoriaClinicaController::class,
    'raza' => C\RazaController::class,
    'vacuna' => C\VacunaController::class,
];

$resourcesWithSeguimiento = ['cita', 'historia_clinica', 'vacuna']; // ⚡ solo estos tienen seguimiento

foreach ($resourcesWithForms as $uri => $controller) {
    Route::resource($uri, $controller);
    Route::get("$uri/form/{action}/{id?}", [$controller, 'handleAction'])->name("$uri.form");

    // Solo genera rutas de seguimiento si aplica
    if (in_array($uri, $resourcesWithSeguimiento)) {
        $controllerBase = $uri === 'historia_clinica' ? 'HistoriaClinica' : ucfirst($uri);
        $seguimientoController = "App\\Http\\Controllers\\{$controllerBase}SeguimientoController";

        Route::prefix("$uri/seguimientos")->name("$uri.seguimientos.")->group(function () use ($seguimientoController) {
            Route::post('/', [$seguimientoController, 'store'])->name('store');
            Route::put('/{id}', [$seguimientoController, 'update'])->name('update');
            Route::delete('/{id}', [$seguimientoController, 'destroy'])->name('destroy');
        });
    }
}

// Grupo para itemsimple
Route::prefix('itemsimple')->name('itemsimple.')->group(function () {
    Route::resource('/', C\ItemSimpleController::class);
    Route::get('/form/{action}/{id?}', [C\ItemSimpleController::class, 'handleAction'])->name('form');
    Route::put('/{id}', [C\ItemSimpleController::class, 'update'])->name('update.put'); // opcional
});

// Archivos adicionales
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
