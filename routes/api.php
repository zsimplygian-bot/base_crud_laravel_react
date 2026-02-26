<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ListadoController;
use App\Http\Controllers\Api\ListaController;
use App\Http\Controllers\CitaController;
use App\Http\Controllers\HistoriaController;
use App\Http\Controllers\HistoriaProductoController;
use App\Http\Controllers\Api\DashboardChartsController;
use App\Http\Controllers\ClienteController;
Route::get('/dashboard/charts', [DashboardChartsController::class, 'charts']);
Route::post('/cita/{id}/atender', [CitaController::class, 'atender']);
Route::post('/cita/{id}/cancelar', [CitaController::class, 'cancelar']);
Route::post('/cita/{id}/notificar', [CitaController::class, 'notificar']);
Route::get('/citas/proximas', [CitaController::class, 'proximas']);
Route::get('/cita/eventos', [CitaController::class, 'eventos']);
Route::get('/historia/{id}/records', [HistoriaController::class, 'records']);
Route::get('/historia_producto/{id}/records', [HistoriaProductoController::class, 'records']);
Route::get('/index', [ListadoController::class, 'index']);
Route::get('/listas', [ListaController::class, 'obtenerLista']);
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');