<?php

namespace App\Policies;

use App\Models\Cashier;
use App\Models\Customer;
use App\Models\Item;

class ItemPolicy
{
    public function viewAny(Cashier|Customer $user): bool
    {
        return $user instanceof Cashier;
    }

    public function view(Cashier|Customer $user, Item $item): bool
    {
        return $user instanceof Cashier;
    }

    public function create(Cashier|Customer $user): bool
    {
        return $user instanceof Cashier;
    }

    public function update(Cashier|Customer $user, Item $item): bool
    {
        return $user instanceof Cashier;
    }

    public function delete(Cashier|Customer $user, Item $item): bool
    {
        return $user instanceof Cashier;
    }

    public function restore(Cashier|Customer $user, Item $item): bool
    {
        return false;
    }

    public function forceDelete(Cashier|Customer $user, Item $item): bool
    {
        return false;
    }
}
