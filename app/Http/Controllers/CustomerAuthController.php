<?php

namespace App\Http\Controllers;

use App\Http\Requests\CustomerLoginRequest;
use App\Http\Requests\CustomerRegisterRequest;
use App\Models\Customer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CustomerAuthController extends Controller
{
    public function register(CustomerRegisterRequest $request): RedirectResponse
    {
        $customer = Customer::create($request->validated());
        Auth::guard('customer')->login($customer);
        $request->session()->regenerate();

        return redirect()->intended(route('storefront.index'));
    }

    public function login(CustomerLoginRequest $request): RedirectResponse
    {
        $remember = (bool) $request->boolean('remember');

        if (Auth::guard('customer')->attempt($request->only('email', 'password'), $remember)) {
            $request->session()->regenerate();

            return redirect()->intended(route('storefront.index'));
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::guard('customer')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('storefront.index');
    }
}
