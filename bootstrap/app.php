<?php

use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
        $middleware->redirectGuestsTo(function ($request) {
            $name = $request->route()?->getName();

            if (is_string($name)) {
                if (str_starts_with($name, 'cashier.')) {
                    return route('cashier.login');
                }

                if (str_starts_with($name, 'customer.')) {
                    return route('customer.login');
                }
            }

            $path = ltrim($request->path(), '/');
            if (str_starts_with($path, 'cashier')) {
                return route('cashier.login');
            }

            if (str_starts_with($path, 'customer')) {
                return route('customer.login');
            }

            return route('customer.login');
        });
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
