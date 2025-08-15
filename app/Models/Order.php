<?php

namespace App\Models;

use App\Enums\OrderStatus;
use App\Policies\OrderPolicy;
use Illuminate\Database\Eloquent\Attributes\UsePolicy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[UsePolicy(OrderPolicy::class)]
class Order extends Model
{
    /** @use HasFactory<\Database\Factories\OrderFactory> */
    use HasFactory;

    protected $casts = [
        'status' => OrderStatus::class,
    ];

    protected $fillable = [
        'customer_id',
        'cashier_id',
        'status',
        'total',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function cashier(): BelongsTo
    {
        return $this->belongsTo(Cashier::class);
    }

    public function items(): BelongsToMany
    {
        return $this->belongsToMany(Item::class, 'order_item')
            ->using(OrderItem::class)
            ->withPivot(['quantity', 'price'])
            ->withTimestamps();
    }

    public function recalculateTotal()
    {
        $this->load('items');
        $total = $this->items->sum(fn ($item) => $item->pivot->quantity * $item->pivot->price);
        $this->update(['total' => $total]);
    }
}
