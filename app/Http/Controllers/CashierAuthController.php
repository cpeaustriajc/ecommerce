<?php

namespace App\Http\Controllers;

use App\Http\Requests\CashierLoginRequest;
use App\Http\Requests\CashierRegisterRequest;
use App\Models\Cashier;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CashierAuthController extends Controller
{
    public function register(CashierRegisterRequest $request): RedirectResponse
    {
        $cashier = Cashier::create($request->validated());
        Auth::guard('cashier')->login($cashier);
        $request->session()->regenerate();

        return redirect()->intended(route('cashier.dashboard'));
    }

    public function login(CashierLoginRequest $request): RedirectResponse
    {
        $remember = (bool) $request->boolean('remember');

        if (Auth::guard('cashier')->attempt($request->only('email', 'password'), $remember)) {
            $request->session()->regenerate();
            return redirect()->intended(route('cashier.dashboard'));
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::guard('cashier')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('cashier.login');
    }
}
