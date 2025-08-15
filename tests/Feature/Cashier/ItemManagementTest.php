<?php

use App\Models\Cashier;
use App\Models\Item;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\delete;
use function Pest\Laravel\get;
use function Pest\Laravel\post;
use function Pest\Laravel\put;

function loginCashier(): Cashier
{
    $cashier = Cashier::factory()->create();
    actingAs($cashier, 'cashier');

    return $cashier;
}

it('lists items for cashier', function () {
    loginCashier();
    Item::factory()->count(3)->create();

    $response = get(route('cashier.items.index'));

    $response->assertOk();
});

it('creates an item', function () {
    loginCashier();

    $response = post(route('cashier.items.store'), [
        'name' => 'Widget',
        'description' => 'Nice widget',
        'price' => 9.99,
    ]);

    $response->assertRedirect(route('cashier.items.index'));
    expect(Item::where('name', 'Widget')->exists())->toBeTrue();
});

it('updates an item', function () {
    loginCashier();
    $item = Item::factory()->create();

    $response = put(route('cashier.items.update', $item), [
        'name' => 'Updated',
        'description' => 'Updated desc',
        'price' => 19.99,
    ]);

    $response->assertRedirect(route('cashier.items.index'));
    $item->refresh();
    expect($item->name)->toBe('Updated');
});

it('deletes an item', function () {
    loginCashier();
    $item = Item::factory()->create();

    $response = delete(route('cashier.items.destroy', $item));

    $response->assertRedirect(route('cashier.items.index'));
    expect(Item::find($item->id))->toBeNull();
});
