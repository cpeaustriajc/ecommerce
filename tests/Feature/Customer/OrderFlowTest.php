<?php

use App\Models\Customer;
use App\Models\Item;
use App\Models\Order;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\get;
use function Pest\Laravel\post;
use function Pest\Laravel\put;

function loginCustomer(): Customer
{
    $customer = Customer::factory()->create();
    actingAs($customer, 'customer');

    return $customer;
}

it('customer can list their orders', function () {
    $customer = loginCustomer();
    $other = Customer::factory()->create();

    Order::factory()->count(2)->create(['customer_id' => $customer->id]);
    Order::factory()->count(2)->create(['customer_id' => $other->id]);

    $response = get(route('customer.orders.index'));
    $response->assertOk();
});

it('customer can create an order for an item', function () {
    loginCustomer();
    $item = Item::factory()->create(['price' => 5.00]);

    $response = post(route('customer.orders.store'), [
        'itemId' => $item->id,
        'quantity' => 2,
    ]);

    $response->assertRedirect(route('customer.orders.index'));
    $this->assertDatabaseHas('orders', ['total' => 10.00]);
});

it('customer can update an order item quantity', function () {
    loginCustomer();
    $item = Item::factory()->create(['price' => 5.00]);

    $response = post(route('customer.orders.store'), [
        'itemId' => $item->id,
        'quantity' => 2,
    ]);

    $order = Order::latest('id')->first();

    $response = put(route('customer.orders.update', $order), [
        'itemId' => $item->id,
        'quantity' => 3,
    ]);

    $response->assertRedirect(route('customer.orders.index'));
    $order->refresh();
    expect((float) $order->total)->toBe(15.00);
});
