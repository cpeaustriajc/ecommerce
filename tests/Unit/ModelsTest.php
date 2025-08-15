<?php

use App\Enums\OrderStatus;
use App\Models\Item;
use App\Models\Order;

it('recalculates order total correctly', function () {
    $itemA = Item::factory()->create(['price' => 2.0]);
    $itemB = Item::factory()->create(['price' => 3.0]);

    $order = Order::factory()->create(['total' => 0, 'status' => OrderStatus::Pending]);
    $order->items()->sync([
        $itemA->id => ['quantity' => 2, 'price' => 2.0],
        $itemB->id => ['quantity' => 1, 'price' => 3.0],
    ]);

    $order->recalculateTotal();

    expect((float) $order->fresh()->total)->toBe(7.0);
});
