<?php

namespace App\Support;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Number;

class LocaleManager
{
    /** @return array<string, string> */
    public function supported(): array
    {
        return [
            'en' => 'USD',
            'ph' => 'PHP',
            'sg' => 'SGD',
        ];
    }

    public function resolveLocale(Request $request): string
    {
        $userLocale = $request->user('customer')?->locale
            ?? $request->user('cashier')?->locale;

        if (is_string($userLocale) && isset($this->supported()[$userLocale])) {
            return $userLocale;
        }

        return $request->getPreferredLanguage(array_keys($this->supported()))
            ?: config('app.locale', 'en');
    }

    public function currencyFor(string $locale): string
    {
        return $this->supported()[$locale] ?? config('invoices.default_currency', 'USD');
    }

    public function apply(Request $request): void
    {
        $locale = $this->resolveLocale($request);
        $currency = $this->currencyFor($locale);

        app()->setLocale($locale);
        Number::useLocale($locale);
        Number::useCurrency($currency);

        if (class_exists(Carbon::class)) {
            Carbon::setLocale($locale);
        }
    }
}
