<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function show(Customer $customer)
    {
        return Inertia::render('customer/profile', [
            'customer' => $customer,
        ]);
    }

    public function update(Request $request, Customer $customer)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:customers,email,'.$customer->id],
            'phone' => ['nullable', 'string', 'max:20'],
        ]);

        $customer->update($data);

        return redirect()->route('customer.profile.show', $customer)->with('success', 'Profile updated successfully.');
    }
}
