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
    'historia_clinica_anamnesis'  => C\HistoriaClinicaAnamnesisController::class,
    'historia_clinica_seguimiento'  => C\HistoriaClinicaSeguimientoController::class,
    'historia_clinica_procedimiento'  => C\HistoriaClinicaProcedimientoController::class,
    'historia_clinica_medicamento'  => C\HistoriaClinicaMedicamentoController::class,
    'especie'           => C\EspecieController::class,
    'raza'              => C\RazaController::class,
    'motivo_cita'           => C\MotivoCitaController::class,
    'motivo_historia_clinica' => C\MotivoHistoriaClinicaController::class,
    'medicamento'       => C\MedicamentoController::class,
    'procedimiento'     => C\ProcedimientoController::class,
];
// Recursos con rutas adicionales (nested)
foreach ($resourcesWithForms as $uri => $controller) {
    Route::resource($uri, $controller)->parameters([$uri => $uri]);
    Route::get("$uri/form/{action}/{id?}", [$controller, 'handleAction'])->name("$uri.form");
    Route::post("$uri/form", [$controller, 'store'])->name("$uri.form.store");
}
// PDF específico
Route::get('historia_clinica/pdf/{id}', [C\HistoriaClinicaController::class, 'generatePdf'])->name('historia_clinica.pdf');
require __DIR__ . '/settings.php';