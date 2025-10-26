<?php
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers as C;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\BackupController;

// Página principal
Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

// Dashboard
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

// Backup
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/export-db', [BackupController::class, 'export'])->name('export.db');
});

// Recursos principales con formularios
$resourcesWithForms = [
    'cliente'           => C\ClienteController::class,
    'mascota'           => C\MascotaController::class,
    'cita'              => C\CitaController::class,
    'historia_clinica'  => C\HistoriaClinicaController::class,
    'especie'           => C\EspecieController::class,
    'raza'              => C\RazaController::class,
    'motivo_cita'           => C\MotivoCitaController::class,
    'motivo_historia_clinica' => C\MotivoHistoriaClinicaController::class,
    'medicamento'       => C\MedicamentoController::class,
    'procedimiento'     => C\ProcedimientoController::class,
];

// Recursos con rutas adicionales (nested)
$resourcesWithExtras = ['historia_clinica'];

foreach ($resourcesWithForms as $uri => $controller) {
    Route::resource($uri, $controller)->parameters([$uri => $uri]);
    Route::get("$uri/form/{action}/{id?}", [$controller, 'handleAction'])->name("$uri.form");

    if (in_array($uri, $resourcesWithExtras)) {
        // Forzamos el CamelCase correcto
        $controllerBase = 'HistoriaClinica';

        $seguimientoController   = "App\\Http\\Controllers\\{$controllerBase}SeguimientoController";
        $procedimientoController = "App\\Http\\Controllers\\{$controllerBase}ProcedimientoController";
        $medicamentoController   = "App\\Http\\Controllers\\{$controllerBase}MedicamentoController";
        $anamnesisController     = "App\\Http\\Controllers\\{$controllerBase}AnamnesisController";

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

// PDF específico
Route::get('historia_clinica/pdf/{id}', [C\HistoriaClinicaController::class, 'generatePdf'])->name('historia_clinica.pdf');

require __DIR__ . '/settings.php';
