<?php

namespace App\Policies;

use App\Models\Customer;

class CustomerPolicy
{
    public function view(Customer $user, Customer $customer): bool
    {
        return $user->id === $customer->id;
    }

    public function update(Customer $user, Customer $customer): bool
    {
        return $user->id === $customer->id;
    }

    public function delete(Customer $user, Customer $customer): bool
    {
        return false; // Not supported in this app
    }

    public function viewAny(Customer $user): bool
    {
        return false;
    }

    public function create(Customer $user): bool
    {
        return false;
    }
}
