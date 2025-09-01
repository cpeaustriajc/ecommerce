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
            'fil' => 'PHP',
            'en_PH' => 'PHP',
            'en_SG' => 'SGD',
            'sg' => 'SGD',
        ];
    }

    private function normalize(string $locale): array
    {
        $norm = str_replace('-', '_', strtolower($locale));

        return match ($norm) {
            'ph' => ['app' => 'fil', 'icu' => 'fil_PH'],
            'fil' => ['app' => 'fil', 'icu' => 'fil_PH'],
            'en_ph' => ['app' => 'en', 'icu' => 'en_PH'],
            'sg' => ['app' => 'en', 'icu' => 'en_SG'],
            'en_sg' => ['app' => 'en', 'icu' => 'en_SG'],
            default => [
                'app' => strtok($norm, '_') ?: 'en',
                'icu' => $norm,
            ],
        };
    }

    public function resolveLocale(Request $request): string
    {
        $userLocale = $request->user('customer')?->locale
            ?? $request->user('cashier')?->locale;

        $map = $this->supported();

        if (is_string($userLocale) && isset($map[strtolower($userLocale)])) {
            return strtolower($userLocale);
        }

        $preferred = $request->getPreferredLanguage(array_keys($map));

        return $preferred ? strtolower($preferred) : strtolower(config('app.locale', 'en'));
    }

    public function currencyFor(string $rawLocale): string
    {
        $map = $this->supported();
        $key = str_replace('-', '_', strtolower($rawLocale));

        if (isset($map[$key])) {
            return $map[$key];
        }

        if (str_contains($key, 'ph')) {
            return 'PHP';
        }
        if (str_contains($key, 'sg')) {
            return 'SGD';
        }

        return config('invoices.default_currency', 'USD');
    }

    public function apply(Request $request): void
    {
        $raw = $this->resolveLocale($request);
        $norm = $this->normalize($raw);

        $appLocale = $norm['app'];
        $icuLocale = $norm['icu'];

        app()->setLocale($appLocale);
        Number::useLocale($icuLocale);
        Number::useCurrency($this->currencyFor($raw));

        if (class_exists(Carbon::class)) {
            Carbon::setLocale($appLocale);
        }
    }

    public function applyFromLocale(string $locale): void
    {
        $locale = trim($locale);
        if ($locale === '') {
            $locale = config('app.locale', 'en');

            $norm = $this->normalize($locale);
            $appLocale = $norm['app'];
            $icuLocale = $norm['icu'];

            app()->setLocale($appLocale);
            Number::useLocale($icuLocale);
            Number::useCurrency($this->currencyFor($locale));
            if (class_exists(Carbon::class)) {
                Carbon::setLocale($appLocale);
            }
        }
    }
}
