<?php
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers as C;
// routes/api.php
//use App\Http\Controllers\UploadController;
//Route::post('/ruta-api-upload', [UploadController::class, 'uploadFile']);
// Página principal
Route::get('/', fn () => Inertia::render('welcome'))->name('home');
// Dashboard
Route::get('/dashboard', [C\DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');
// Recursos con formularios personalizados
$resourcesWithForms = [
    'cliente' => C\ClienteController::class,
    'mascota' => C\MascotaController::class,
    'cita' => C\CitaController::class,
    'historia_clinica' => C\HistoriaClinicaController::class,
    'raza' => C\RazaController::class,
    'vacuna' => C\VacunaController::class,
];
foreach ($resourcesWithForms as $uri => $controller) {
    Route::resource($uri, $controller);
    Route::get("$uri/form/{action}/{id?}", [$controller, 'handleAction'])->name("$uri.form");
}
// Seguimientos de historia clínica (CRUD + ruta de formulario)
Route::get('/seguimientos', [C\HistoriaClinicaSeguimientoController::class, 'index'])->name('seguimientos.index');
Route::get('/seguimientos/form/{action}/{id?}', [C\HistoriaClinicaSeguimientoController::class, 'handleAction'])->name('seguimientos.form');
Route::post('/seguimientos', [C\HistoriaClinicaSeguimientoController::class, 'store'])->name('seguimientos.store');
Route::put('/seguimientos/{id}', [C\HistoriaClinicaSeguimientoController::class, 'update'])->name('seguimientos.update');
Route::delete('/seguimientos/{id}', [C\HistoriaClinicaSeguimientoController::class, 'destroy'])->name('seguimientos.destroy');

// Grupo para itemsimple
Route::prefix('itemsimple')->name('itemsimple.')->group(function () {
    Route::get('/', [C\ItemSimpleController::class, 'index'])->name('index');
    Route::get('/form/{action}/{id?}', [C\ItemSimpleController::class, 'handleAction'])->name('form');
    Route::post('/', [C\ItemSimpleController::class, 'store'])->name('store');
    Route::patch('/{id}', [C\ItemSimpleController::class, 'update'])->name('update');
    Route::delete('/{id}', [C\ItemSimpleController::class, 'destroy'])->name('destroy');
    Route::put('/{id}', [C\ItemSimpleController::class, 'update'])->name('update.put');
});
// Archivos adicionales
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';