<?php

use App\Models\Cashier;
use App\Models\Customer;
use App\Models\Item;
use App\Models\Order;

it('item policy allows only cashiers', function () {
    $cashier = Cashier::factory()->create();
    $customer = Customer::factory()->create();
    $item = Item::factory()->create();

    expect((new App\Policies\ItemPolicy)->viewAny($cashier))->toBeTrue();
    expect((new App\Policies\ItemPolicy)->viewAny($customer))->toBeFalse();

    expect((new App\Policies\ItemPolicy)->create($cashier))->toBeTrue();
    expect((new App\Policies\ItemPolicy)->create($customer))->toBeFalse();

    expect((new App\Policies\ItemPolicy)->update($cashier, $item))->toBeTrue();
    expect((new App\Policies\ItemPolicy)->update($customer, $item))->toBeFalse();
});

it('order policy allows owner customer or any cashier', function () {
    $cashier = Cashier::factory()->create();
    $owner = Customer::factory()->create();
    $other = Customer::factory()->create();
    $order = Order::factory()->create(['customer_id' => $owner->id]);

    $policy = new App\Policies\OrderPolicy;

    expect($policy->view($cashier, $order))->toBeTrue();
    expect($policy->view($owner, $order))->toBeTrue();
    expect($policy->view($other, $order))->toBeFalse();

    expect($policy->update($cashier, $order))->toBeTrue();
    expect($policy->update($owner, $order))->toBeTrue();
    expect($policy->update($other, $order))->toBeFalse();

    expect($policy->delete($cashier, $order))->toBeTrue();
    expect($policy->delete($owner, $order))->toBeTrue();
    expect($policy->delete($other, $order))->toBeFalse();
});
