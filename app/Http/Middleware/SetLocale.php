<?php

namespace App\Http\Middleware;

use App\Support\LocaleManager;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    public function __construct(private LocaleManager $locales) {}

    /** @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next */
    public function handle(Request $request, Closure $next): Response
    {
        $this->locales->apply($request);

        return $next($request);
    }
}
