<?php
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers as C;
// routes/api.php
use App\Http\Controllers\UploadController;
Route::post('/ruta-api-upload', [UploadController::class, 'uploadFile']);
// Página principal
Route::get('/', fn () => Inertia::render('welcome'))->name('home');
// Dashboard
Route::get('/dashboard', [C\DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');
// Recursos con formularios personalizados
$resourcesWithForms = [
    'cliente' => C\ClienteController::class,
    'mascota' => C\MascotaController::class,
    'cita' => C\CitaController::class,
    'consulta' => C\ConsultaController::class,
];
foreach ($resourcesWithForms as $uri => $controller) {
    Route::resource($uri, $controller);
    Route::get("$uri/form/{action}/{id?}", [$controller, 'handleAction'])->name("$uri.form");
}
// Grupo para itemsimple
Route::prefix('itemsimple')->name('itemsimple.')->group(function () {
    Route::get('/', [C\ItemSimpleController::class, 'index'])->name('index');
    Route::get('/form/{action}/{id?}', [C\ItemSimpleController::class, 'handleAction'])->name('form');
    Route::post('/', [C\ItemSimpleController::class, 'store'])->name('store');
    Route::patch('/{id}', [C\ItemSimpleController::class, 'update'])->name('update');
    Route::delete('/{id}', [C\ItemSimpleController::class, 'destroy'])->name('destroy');
});
// Archivos adicionales
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';