<?php

use App\Enums\OrderStatus;
use App\Models\Cashier;
use App\Models\Customer;
use App\Models\Item;
use App\Models\Order;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\delete;
use function Pest\Laravel\get;
use function Pest\Laravel\post;
use function Pest\Laravel\put;

it('cashier can create order with items and totals are calculated', function () {
    $cashier = Cashier::factory()->create();
    actingAs($cashier, 'cashier');

    $customer = Customer::factory()->create();
    $itemA = Item::factory()->create(['price' => 2.5]);
    $itemB = Item::factory()->create(['price' => 3.0]);

    $response = post(route('cashier.orders.store'), [
        'customer_id' => $customer->id,
        'status' => OrderStatus::Pending->value,
        'items' => [
            ['item_id' => $itemA->id, 'quantity' => 2, 'price' => 2.5],
            ['item_id' => $itemB->id, 'quantity' => 1, 'price' => 3.0],
        ],
    ]);

    $response->assertRedirect(route('cashier.orders.index'));

    $order = Order::latest('id')->first();
    expect((float) $order->total)->toBe(8.0);
});

it('cashier can view, edit, update status and delete an order', function () {
    $cashier = Cashier::factory()->create();
    actingAs($cashier, 'cashier');

    $order = Order::factory()->create(['status' => OrderStatus::Pending]);

    get(route('cashier.orders.index'))->assertOk();

    get(route('cashier.orders.show', $order))->assertOk();

    get(route('cashier.orders.edit', $order))->assertOk();

    put(route('cashier.orders.update', $order), [
        'status' => OrderStatus::Completed->value,
    ])->assertRedirect(route('cashier.orders.index'));

    $order->refresh();
    expect($order->status)->toBe(OrderStatus::Completed);

    delete(route('cashier.orders.destroy', $order))
        ->assertRedirect(route('cashier.orders.index'));

    expect(Order::find($order->id))->toBeNull();
});
