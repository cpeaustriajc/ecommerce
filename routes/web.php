<?php

use App\Http\Controllers\CashierAuthController;
use App\Http\Controllers\CashierDashboardController;
use App\Http\Controllers\CashierOrderController;
use App\Http\Controllers\CustomerAuthController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\CustomerOrderController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\StorefrontController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [StorefrontController::class, 'index'])->name('storefront.index');
Route::get('/items/{item}', [StorefrontController::class, 'show'])->name('storefront.show');

Route::prefix('customer')
    ->name('customer.')
    ->group(function () {
        Route::middleware('guest:customer')->group(function () {
            Route::get('login', fn () => Inertia::render('customer/auth/login'))->name('login');
            Route::post('login', [CustomerAuthController::class, 'login'])->name('login.submit');
            Route::get('register', fn () => Inertia::render('customer/auth/register'))->name('register');
            Route::post('register', [CustomerAuthController::class, 'register'])->name('register.submit');
        });

        Route::middleware('auth:customer')->group(function () {
            Route::get('/profile/{customer}', [CustomerController::class, 'show'])->name('profile.show');
            Route::get('/profile/edit', [CustomerController::class, 'edit'])->name('profile.edit');
            Route::put('/profile/{customer}', [CustomerController::class, 'update'])->name('profile.update');

            Route::get('/orders', [CustomerOrderController::class, 'index'])->name('orders.index');
            Route::get('/orders/{order}', [CustomerOrderController::class, 'show'])->name('orders.show');
            Route::post('/orders', [CustomerOrderController::class, 'store'])->name('orders.store');
            Route::put('/orders/{order}', [CustomerOrderController::class, 'update'])->name('orders.update');
            Route::delete('/orders/{order}', [CustomerOrderController::class, 'destroy'])->name('orders.destroy');

            Route::post('logout', [CustomerAuthController::class, 'logout'])->name('logout');
        });
    });

Route::prefix('cashier')
    ->name('cashier.')
    ->group(function () {
        Route::middleware('guest:cashier')->group(function () {
            Route::get('login', fn () => Inertia::render('cashier/auth/login'))->name('login');
            Route::post('login', [CashierAuthController::class, 'login'])->name('login.submit');
            Route::get('register', fn () => Inertia::render('cashier/auth/register'))->name('register');
            Route::post('register', [CashierAuthController::class, 'register'])->name('register.submit');
        });

        Route::middleware('auth:cashier')->group(function () {
            Route::get('dashboard', [CashierDashboardController::class, 'index'])->name('dashboard');
            Route::resource('items', ItemController::class)->names([
                'index' => 'items.index',
                'create' => 'items.create',
                'store' => 'items.store',
                'show' => 'items.show',
                'edit' => 'items.edit',
                'update' => 'items.update',
                'destroy' => 'items.destroy',
            ]);

            Route::resource('orders', CashierOrderController::class)->names([
                'index' => 'orders.index',
                'create' => 'orders.create',
                'store' => 'orders.store',
                'show' => 'orders.show',
                'edit' => 'orders.edit',
                'update' => 'orders.update',
                'destroy' => 'orders.destroy',
            ]);

            Route::post('logout', [CashierAuthController::class, 'logout'])->name('logout');
        });
    });
