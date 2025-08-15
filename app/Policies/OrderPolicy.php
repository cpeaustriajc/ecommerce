<?php

namespace App\Policies;

use App\Models\Cashier;
use App\Models\Customer;
use App\Models\Order;
use Illuminate\Database\Eloquent\Attributes\UsePolicy;

#[UsePolicy(OrderPolicy::class)]
class OrderPolicy
{
    public function viewAny(Customer|Cashier $user): bool
    {
        return true;
    }

    public function view(Customer|Cashier $user, Order $order): bool
    {
        return $user instanceof Cashier
            || ($user instanceof Customer && $user->id === $order->customer_id);
    }

    public function create(Customer|Cashier $user): bool
    {
        return true;
    }

    public function update(Customer|Cashier $user, Order $order): bool
    {
        return $user instanceof Cashier
            || ($user instanceof Customer && $user->id === $order->customer_id);
    }

    public function delete(Customer|Cashier $user, Order $order): bool
    {
        return $user instanceof Cashier
            || ($user instanceof Customer && $user->id === $order->customer_id);
    }
}
