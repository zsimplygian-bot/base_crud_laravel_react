<?php
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\TwoFactorAuthenticationController;
use App\Http\Controllers\Settings\DatabaseIEController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
Route::middleware('auth')->group(function () {
    Route::redirect('settings', '/settings/profile');
    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('settings/password', [PasswordController::class, 'edit'])->name('user-password.edit');
    Route::put('settings/password', [PasswordController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('user-password.update');
    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance.edit');
    Route::get('settings/two-factor', [TwoFactorAuthenticationController::class, 'show'])
        ->name('two-factor.show');
    Route::get('settings/database', function () {
        return Inertia::render('settings/database');
        })->name('database.edit');
    Route::middleware(['auth', 'verified'])->group(function () { 
    Route::get('/export-db', [DatabaseIEController::class, 'export'])->name('export.db');
    Route::post('/import-db', [DatabaseIEController::class, 'import'])->name('import.db');
    });
});