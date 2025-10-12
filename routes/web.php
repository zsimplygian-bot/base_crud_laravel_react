<?php
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers as C;
use App\Http\Controllers\BackupController;

// Backup
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/export-db', [BackupController::class, 'export'])->name('export.db');
});

// Página principal
Route::get('/', fn () => Inertia::render('welcome'))->name('home');

// Dashboard
Route::get('/dashboard', [C\DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

$resourcesWithForms = [
    'cliente'           => C\ClienteController::class,
    'mascota'           => C\MascotaController::class,
    'cita'              => C\CitaController::class,
    'historia_clinica'  => C\HistoriaClinicaController::class,
    'raza'              => C\RazaController::class,
    'vacuna'            => C\VacunaController::class,
    'medicamento'       => C\MedicamentoController::class,
    'procedimiento'     => C\ProcedimientoController::class,
];

$resourcesWithExtras = ['historia_clinica',];

foreach ($resourcesWithForms as $uri => $controller) {
    Route::resource($uri, $controller);
    Route::get("$uri/form/{action}/{id?}", [$controller, 'handleAction'])->name("$uri.form");

    if (in_array($uri, $resourcesWithExtras)) {
        $controllerBase = $uri === 'historia_clinica' ? 'HistoriaClinica' : ucfirst($uri);

        $seguimientoController = "App\\Http\\Controllers\\{$controllerBase}SeguimientoController";
        $procedimientoController = "App\\Http\\Controllers\\{$controllerBase}ProcedimientoController";
        $medicamentoController = "App\\Http\\Controllers\\{$controllerBase}MedicamentoController";
        $anamnesisController = "App\\Http\\Controllers\\{$controllerBase}AnamnesisController";
        // Seguimientos
        Route::prefix("$uri/seguimientos")->name("$uri.seguimientos.")->group(function () use ($seguimientoController) {
            Route::post('/', [$seguimientoController, 'store'])->name('store');
            Route::put('/{seguimiento}', [$seguimientoController, 'update'])->name('update');
            Route::delete('/{seguimiento}', [$seguimientoController, 'destroy'])->name('destroy');
        });
        // Procedimientos
        Route::prefix("$uri/procedimientos")->name("$uri.procedimientos.")->group(function () use ($procedimientoController) {
            Route::post('/', [$procedimientoController, 'store'])->name('store');
            Route::put('/{procedimiento}', [$procedimientoController, 'update'])->name('update');
            Route::delete('/{procedimiento}', [$procedimientoController, 'destroy'])->name('destroy');
        });
        // Medicamentos
        Route::prefix("$uri/medicamentos")->name("$uri.medicamentos.")->group(function () use ($medicamentoController) {
            Route::post('/', [$medicamentoController, 'store'])->name('store');
            Route::put('/{medicamento}', [$medicamentoController, 'update'])->name('update');
            Route::delete('/{medicamento}', [$medicamentoController, 'destroy'])->name('destroy');
        });
        // Anamnesis
        Route::prefix("$uri/anamnesis")->name("$uri.anamnesis.")->group(function () use ($anamnesisController) {
            Route::post('/', [$anamnesisController, 'store'])->name('store');
            Route::put('/{anamnesis}', [$anamnesisController, 'update'])->name('update');
            Route::delete('/{anamnesis}', [$anamnesisController, 'destroy'])->name('destroy');
        });
    }
}
// PDF específicos
Route::get('historia_clinica/pdf/{id}', [C\HistoriaClinicaController::class, 'generatePdf'])->name('historia_clinica.pdf');

// Grupo para ItemSimple
Route::prefix('itemsimple')->name('itemsimple.')->group(function () {
    Route::get('/', [C\ItemSimpleController::class, 'index'])->name('index');
    Route::get('/form/{action}/{id?}', [C\ItemSimpleController::class, 'handleAction'])->name('form');
    Route::post('/', [C\ItemSimpleController::class, 'store'])->name('store');
    Route::put('/{id}', [C\ItemSimpleController::class, 'update'])->name('update');
    Route::delete('/{id}', [C\ItemSimpleController::class, 'destroy'])->name('destroy');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
