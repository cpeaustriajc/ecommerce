<?php

namespace App\Providers;

use App\Support\InvoiceBuilder;
use App\Support\LocaleManager;
use App\Support\OrderBuilder;
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
        $this->app->singleton(LocaleManager::class);
        $this->app->bind(OrderBuilder::class);
        $this->app->bind(InvoiceBuilder::class);

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
