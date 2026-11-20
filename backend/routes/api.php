<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\RegistrationController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/events', [EventController::class, 'index']);
Route::get('/events/{id}', [EventController::class, 'show']);

// Protected Student & Organizer routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/my-registrations', [RegistrationController::class, 'myRegistrations']);
    Route::post('/events/{id}/register', [RegistrationController::class, 'register']);
    Route::post('/registrations/{id}/cancel', [RegistrationController::class, 'cancel']);

    // Organizer-Only Routes
    Route::middleware('organizer')->group(function () {
        Route::get('/organizer/events', [EventController::class, 'organizerEvents']);
        Route::post('/events', [EventController::class, 'store']);
        Route::put('/events/{id}', [EventController::class, 'update']);
        Route::get('/events/{id}/registrations', [EventController::class, 'eventRegistrations']);
        Route::patch('/registrations/{id}/status', [RegistrationController::class, 'updateStatus']);
        Route::post('/events/{id}/attendance', [AttendanceController::class, 'markAttendance']);
    });
});