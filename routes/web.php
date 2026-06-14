<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\MenuController;
use App\Http\Controllers\Admin\WarehouseController;
use App\Http\Controllers\Admin\IngredientController;
use App\Http\Controllers\Admin\StockController;
use App\Http\Controllers\Admin\ResepController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\LaporanController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Kasir\TransactionController;
use App\Http\Controllers\Kasir\ProfileController;
use App\Http\Controllers\Inventoris\DashboardController as InventorisDashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [AuthController::class, 'showLogin'])->name('login');
Route::post('/auth/login', [AuthController::class, 'login'])->name('login.post');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::get('/auth/login', function () {
    return redirect()->route('login');
});

// Admin / Owner
Route::middleware(['role:owner'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::patch('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    Route::post('/users/{id}/restore', [UserController::class, 'restore'])->name('users.restore');
    Route::post('/users/{user}/toggle-active', [UserController::class, 'toggleActive'])->name('users.toggle-active');
    Route::post('/users/{user}/reset-pin', [UserController::class, 'resetPin'])->name('users.reset-pin');

    Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::patch('/categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');
    Route::post('/categories/{id}/restore', [CategoryController::class, 'restore'])->name('categories.restore');

    Route::get('/menus', [MenuController::class, 'index'])->name('menus.index');
    Route::post('/menus', [MenuController::class, 'store'])->name('menus.store');
    Route::patch('/menus/{menu}', [MenuController::class, 'update'])->name('menus.update');
    Route::delete('/menus/{menu}', [MenuController::class, 'destroy'])->name('menus.destroy');
    Route::post('/menus/{id}/restore', [MenuController::class, 'restore'])->name('menus.restore');

    Route::get('/warehouses', [WarehouseController::class, 'index'])->name('warehouses.index');
    Route::post('/warehouses', [WarehouseController::class, 'store'])->name('warehouses.store');
    Route::patch('/warehouses/{warehouse}', [WarehouseController::class, 'update'])->name('warehouses.update');
    Route::delete('/warehouses/{warehouse}', [WarehouseController::class, 'destroy'])->name('warehouses.destroy');

    Route::get('/ingredients', [IngredientController::class, 'index'])->name('ingredients.index');
    Route::post('/ingredients', [IngredientController::class, 'store'])->name('ingredients.store');
    Route::patch('/ingredients/{ingredient}', [IngredientController::class, 'update'])->name('ingredients.update');
    Route::delete('/ingredients/{ingredient}', [IngredientController::class, 'destroy'])->name('ingredients.destroy');

    Route::get('/stock', [StockController::class, 'index'])->name('stock.index');
    Route::post('/stock/add', [StockController::class, 'addStock'])->name('stock.add');
    Route::post('/stock/remove', [StockController::class, 'removeStock'])->name('stock.remove');
    Route::post('/stock/adjust', [StockController::class, 'adjustStock'])->name('stock.adjust');

    Route::get('/resep', [ResepController::class, 'index'])->name('resep.index');
    Route::get('/resep/{menu}', [ResepController::class, 'show'])->name('resep.show');
    Route::get('/resep/{menu}/stock', [ResepController::class, 'calculateStock'])->name('resep.stock');
    Route::post('/resep', [ResepController::class, 'store'])->name('resep.store');
    Route::patch('/resep/{menuIngredient}', [ResepController::class, 'update'])->name('resep.update');
    Route::delete('/resep/{menuIngredient}', [ResepController::class, 'destroy'])->name('resep.destroy');

    Route::get('/laporan', [LaporanController::class, 'index'])->name('laporan.index');
    Route::get('/laporan/export', [LaporanController::class, 'exportExcel'])->name('laporan.export');

    Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
    Route::post('/settings', [SettingsController::class, 'update'])->name('settings.update');
});

// Kasir
Route::middleware(['role:kasir'])->prefix('kasir')->name('kasir.')->group(function () {
    Route::get('/dashboard', [TransactionController::class, 'index'])->name('dashboard');
    Route::post('/dashboard', [TransactionController::class, 'store'])->name('dashboard.store');
    Route::get('/profile', [ProfileController::class, 'index'])->name('profile');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::get('/settings', [ProfileController::class, 'settings'])->name('settings');
    Route::post('/settings', [ProfileController::class, 'updateSettings'])->name('settings.update');
});

// Inventoris
Route::middleware(['role:inventoris'])->prefix('inventoris')->name('inventoris.')->group(function () {
    Route::get('/dashboard', [InventorisDashboardController::class, 'index'])->name('dashboard');
    Route::get('/laporan', [LaporanController::class, 'index'])->name('laporan.index');
    Route::get('/laporan/export', [LaporanController::class, 'exportExcel'])->name('laporan.export');
});
