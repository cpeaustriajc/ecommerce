<?php

use App\Models\Customer;
use App\Models\Item;
use App\Models\Order;
use App\Support\InvoiceBuilder;

it('builds an invoice for an order', function () {
    $customer = Customer::factory()->create();
    $item = Item::factory()->create(['price' => 5.00]);

    $order = Order::factory()->create([
        'customer_id' => $customer->id,
        'status' => 'pending',
        'total' => 0,
    ]);
    $order->items()->attach([$item->id => ['quantity' => 3, 'price' => 5.00]]);
    $order->recalculateTotal();

    /** @var InvoiceBuilder $builder */
    $builder = app(InvoiceBuilder::class);

    $invoice = $builder
        ->setInvoiceable($order)
        ->setBuyer($customer)
        ->setSerial('ORD', $customer->id)
        ->addItem($item, 3, 5.00)
        ->create();

    expect($invoice->id)->toBeInt();
    expect($invoice->items()->count())->toBe(1);
});
