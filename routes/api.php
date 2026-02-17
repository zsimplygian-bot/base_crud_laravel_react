<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ListadoController;
use App\Http\Controllers\Api\ListaController;
use App\Http\Controllers\CitaController;
use App\Http\Controllers\HistoriaClinicaController;
use App\Http\Controllers\Api\DashboardChartsController;
use App\Http\Controllers\ClienteController;
Route::post('/cita/{id}/atender', [CitaController::class, 'atender']);
Route::post('/cita/{id}/cancelar', [CitaController::class, 'cancelar']);
Route::get('/cliente/{id}', [ClienteController::class, 'show']);
Route::get('/cita/{id}/info', [CitaController::class, 'info']);
Route::post('/cita/{id}/notificar', [CitaController::class, 'notificar']);
Route::get('/dashboard/charts', [DashboardChartsController::class, 'charts']);
Route::get('/historia/{id}/records', [HistoriaClinicaController::class, 'records']);
Route::get('/citas/proximas', [CitaController::class, 'proximas']);
Route::get('/index', [ListadoController::class, 'index']);
Route::get('/listas', [ListaController::class, 'obtenerLista']);
Route::get('/listas/item', [ListaController::class, 'getItemInicial']);
Route::get('/cita/eventos', [CitaController::class, 'eventos']);
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');