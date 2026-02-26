<?php

use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ExpenseController;
use App\Http\Controllers\Api\HouseController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ResidentController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - GriyaHub
|--------------------------------------------------------------------------
*/

// ========== Penghuni (Residents) ==========
Route::apiResource('residents', ResidentController::class);

// ========== Rumah (Houses) ==========
Route::apiResource('houses', HouseController::class)->except(['destroy']);
Route::post('houses/{house}/assign', [HouseController::class, 'assignResident']);
Route::put('houses/{house}/unassign', [HouseController::class, 'unassignResident']);

// ========== Pembayaran (Payments) ==========
Route::get('payments', [PaymentController::class, 'index']);
Route::post('payments', [PaymentController::class, 'store']);
Route::put('payments/{payment}', [PaymentController::class, 'update']);

// ========== Pengeluaran (Expenses) ==========
Route::apiResource('expenses', ExpenseController::class);

// ========== Dashboard & Reports ==========
Route::get('dashboard/summary', [DashboardController::class, 'summary']);
Route::get('dashboard/chart', [DashboardController::class, 'chart']);
Route::get('reports/monthly/{tahun}/{bulan}', [DashboardController::class, 'monthlyReport']);
