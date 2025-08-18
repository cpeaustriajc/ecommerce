<?php

namespace App\Events;

use App\Models\Item;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Queue\SerializesModels;

class ItemPriceUpdated implements ShouldBroadcastNow
{
    use InteractsWithSockets, SerializesModels;

    /**
     * @var array{id:int,name:string,price:float}
     */
    public array $item;

    public function __construct(Item $item)
    {
        $this->item = [
            'id' => (int) $item->id,
            'name' => (string) $item->name,
            'price' => (float) $item->price,
        ];
    }

    /**
     * @return array<int, Channel>
     */
    public function broadcastOn(): array
    {
        // Broadcast to a global items channel and a specific per-item channel
        return [
            new Channel('items'),
            new Channel('items.'.$this->item['id']),
        ];
    }

    public function broadcastAs(): string
    {
        return 'ItemPriceUpdated';
    }
}
