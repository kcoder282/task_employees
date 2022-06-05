<?php

use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Employees - User

Route::apiResource('employees', UserController::class);
Route::post('login', [UserController::class, 'login']);
Route::get('login', [UserController::class, 'remember']);
Route::get('employees/status/{id}', [UserController::class, 'change_status']);

// Task 

Route::apiResource('task', TaskController::class);