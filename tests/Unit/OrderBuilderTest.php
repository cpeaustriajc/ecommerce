<?php

use App\Enums\OrderStatus;
use App\Models\Customer;
use App\Models\Item;
use App\Support\OrderBuilder;

it('builds an order with items', function () {
    $customer = Customer::factory()->create();
    $item = Item::factory()->create(['price' => 7.50]);

    /** @var OrderBuilder $builder */
    $builder = app(OrderBuilder::class);

    $order = $builder
        ->forCustomer($customer)
        ->withStatus(OrderStatus::Pending)
        ->addItem($item, 2)
        ->create();

    expect($order->id)->toBeInt();
    expect((float) $order->total)->toBe(15.00);
    expect($order->items()->count())->toBe(1);
});
