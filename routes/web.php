<?php

use App\Http\Controllers\CashierAuthController;
use App\Http\Controllers\CustomerAuthController;
use App\Http\Controllers\CustomerController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn() => Inertia::render('storefront'))->name('storefront');

Route::middleware('guest:customer')->group(function () {
    Route::get('/customer/login', fn() => Inertia::render('customer/auth/login'))->name('customer.login');
    Route::post('/customer/login', [CustomerAuthController::class, 'login'])->name('customer.login.submit');
    Route::get('/customer/register', fn() => Inertia::render('customer/auth/register'))->name('customer.register');
    Route::post('/customer/register', [CustomerAuthController::class, 'register'])->name('customer.register.submit');

});
Route::middleware('auth:customer')->group(function () {
    Route::resource('customer', CustomerController::class)->only(['show', 'edit', 'update'])->names([
        'show' => 'customer.profile',
        'edit' => 'customer.edit',
        'update' => 'customer.update'
    ]);
    Route::post('/customer/logout', [CustomerAuthController::class, 'logout'])->name('customer.logout');
});

Route::middleware(['guest:cashier'])->group(function () {
    Route::get('/cashier/login', fn() => Inertia::render('cashier/auth/login'))->name('cashier.login');
    Route::post('/cashier/login', [CashierAuthController::class, 'login'])->name('cashier.login.submit');
    Route::get('/cashier/register', fn() => Inertia::render('cashier/auth/register'))->name('cashier.register');
    Route::post('/cashier/register', [CashierAuthController::class, 'register'])->name('cashier.register.submit');
});

Route::middleware(['auth:cashier'])->group(function () {
    Route::get('/cashier/dashboard', fn() => Inertia::render('cashier/dashboard'))->name('cashier.dashboard');

    Route::post('/cashier/logout', [CashierAuthController::class, 'logout'])->name('cashier.logout');
});
