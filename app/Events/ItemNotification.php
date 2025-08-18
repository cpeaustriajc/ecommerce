<?php

namespace App\Events;

use App\Models\Item;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Queue\SerializesModels;

class ItemNotification implements ShouldBroadcastNow
{
    use InteractsWithSockets, SerializesModels;

    /**
     * @var array{id:int,name:string}
     */
    public array $item;

    public string $message;

    /** @var array<int, PrivateChannel> */
    protected array $channels;

    public function __construct(Item $item, string $message)
    {
        $this->item = [
            'id' => $item->id,
            'name' => $item->name,
        ];
        $this->message = $message;

        // Pre-compute broadcast channels for each subscriber
        $ids = $item->subscribers()->pluck('customers.id')->all();
        $this->channels = array_map(
            fn ($id) => new PrivateChannel("customer.$id"),
            $ids
        );
    }

    /**
     * @return array<int, PrivateChannel>
     */
    public function broadcastOn(): array
    {
        return $this->channels;
    }

    public function broadcastAs(): string
    {
        return 'ItemNotification';
    }
}
