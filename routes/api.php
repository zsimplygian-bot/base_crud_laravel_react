<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ListadoController;
use App\Http\Controllers\CitaController;

Route::get('/citas/proximas', [CitaController::class, 'proximas']);
Route::get('/index', [ListadoController::class, 'index']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
