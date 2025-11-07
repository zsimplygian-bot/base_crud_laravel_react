<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ListadoController;
use App\Http\Controllers\CitaController;
use App\Http\Controllers\HistoriaClinicaFieldsController;
Route::get('/citas/proximas', [CitaController::class, 'proximas']);
Route::get('/historia/{tipo}/fields', [HistoriaClinicaFieldsController::class, 'fields']);
Route::get('/historia/{id}/records', [HistoriaClinicaFieldsController::class, 'records']);

Route::get('/index', [ListadoController::class, 'index']);
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');