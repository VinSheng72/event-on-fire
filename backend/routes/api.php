<?php

use App\Events\NotificationBroadcast;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\UserEventController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');;

Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('notify', function (Request $req) {
        event(new NotificationBroadcast($req->get('message', '🚀 Reverb is 🔥')));
        return response()->json(['status' => 'broadcast sent']);
    });
});

Route::prefix('events')->group(function () {
    Route::get('/', [EventController::class, 'index']);
    Route::get('popular', [EventController::class, 'popular']);
    Route::get('upcoming', [EventController::class, 'upcoming']);


    Route::middleware('auth:sanctum')->group(function () {

        Route::middleware('role:admin')->group(function () {
            Route::post('/', [EventController::class, 'store']);
            Route::put('{event}', [EventController::class, 'update']);
            Route::delete('{event}', [EventController::class, 'destroy']);
        });

        Route::post('{event}/register', [EventController::class, 'register']);
    });

    Route::get('{event}', [EventController::class, 'show']);
});

Route::prefix('user')->group(function () {
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('events', [UserEventController::class, 'index']);
    });
});
