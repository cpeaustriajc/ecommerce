<?php

use App\Models\Cashier;
use App\Models\Customer;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\get;

it('customer cannot access cashier routes', function () {
    $customer = Customer::factory()->create();
    actingAs($customer, 'customer');

    get(route('cashier.items.index'))->assertRedirect();
});

it('cashier cannot access customer-only pages without being a customer', function () {
    $cashier = Cashier::factory()->create();
    actingAs($cashier, 'cashier');

    get(route('customer.orders.index'))->assertRedirect();
});
