<?php

namespace App\Models;

use App\Policies\ItemPolicy;
use Illuminate\Database\Eloquent\Attributes\UsePolicy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[UsePolicy(ItemPolicy::class)]
class Item extends Model
{
    /** @use HasFactory<\Database\Factories\ItemFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
    ];

    public function orders()
    {
        return $this->belongsToMany(Order::class, 'order_item')
            ->withPivot(['quantity', 'price'])
            ->withTimestamps();
    }
}
