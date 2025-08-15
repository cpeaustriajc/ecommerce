<?php

namespace App\Providers;

use Illuminate\Auth\Middleware\Authenticate;
use Illuminate\Auth\Middleware\RedirectIfAuthenticated;
use Illuminate\Http\Request;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        RedirectIfAuthenticated::redirectUsing(function ($request) {
            if ($request->routeIs('cashier.*')) {
                return route('cashier.dashboard');
            } elseif ($request->routeIs('customer.*')) {
                return route('storefront.index');
            }
        });

        Authenticate::redirectUsing(function (Request $request) {
            if ($request->routeIs('cashier.*')) {
                return route('cashier.login');
            } elseif ($request->routeIs('customer.*')) {
                return route('customer.login');
            }
        });
    }
}
