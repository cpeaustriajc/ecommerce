<?php

use App\Events\ItemPriceUpdated;
use App\Models\Item;

it('broadcasts with correct name and channels', function () {
    $item = Item::factory()->create(['price' => 9.99]);

    $event = new ItemPriceUpdated($item);

    expect($event->broadcastAs())->toBe('ItemPriceUpdated');

    $channels = $event->broadcastOn();
    $names = array_map(fn ($ch) => $ch->name, $channels);

    expect($names)->toBe(['items', 'items.'.$item->id]);
});
