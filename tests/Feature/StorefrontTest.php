<?php

use App\Models\Item;

use function Pest\Laravel\get;

it('renders storefront index with current month items', function () {
    Item::factory()->count(2)->create(['created_at' => now()->subMonth()]);
    Item::factory()->count(3)->create(['created_at' => now()]);

    $response = get('/');

    $response->assertStatus(200);
});

it('renders storefront show page for an item', function () {
    $item = Item::factory()->create();

    $response = get(route('storefront.show', $item));

    $response->assertStatus(200);
});
