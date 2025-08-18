<?php

use App\Mail\OrderReceipt;
use App\Models\Customer;
use App\Models\Item;
use Illuminate\Support\Facades\Mail;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\post;

it('sends a receipt email with invoice after creating an order', function () {
    Mail::fake();

    $customer = Customer::factory()->create();
    actingAs($customer, 'customer');

    $item = Item::factory()->create(['price' => 12.5]);

    post(route('customer.orders.store'), [
        'itemId' => $item->id,
        'quantity' => 2,
    ])->assertRedirect();

    Mail::assertSent(OrderReceipt::class, function (OrderReceipt $mailable) use ($customer) {
        return $mailable->hasTo($customer->email);
    });
});
