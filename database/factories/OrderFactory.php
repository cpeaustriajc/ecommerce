<?php

namespace Database\Factories;

use App\Enums\OrderStatus;
use App\Models\Cashier;
use App\Models\Customer;
use App\Models\Item;
use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'customer_id' => Customer::factory(),
            'cashier_id' => Cashier::factory(),
            'status' => $this->faker->randomElement(array_column(OrderStatus::cases(), 'value')),
            'total' => $this->faker->randomFloat(2, 10, 1000), // Random total between 10 and 1000
        ];
    }

    public function configure(): static
    {
        return $this->afterCreating(function (Order $order) {
            $items = Item::query()->inRandomOrder()->take($this->faker->numberBetween(1, 5))->get();
            if ($items->isEmpty()) {
                $items = Item::factory()->count(3)->create();
            }

            $attach = [];

            foreach ($items as $item) {
                $attach[$item->id] = [
                    'quantity' => $this->faker->numberBetween(1, 5),
                    'price' => $item->price,
                ];
            }

            $order->items()->attach($attach);
            $order->load('items');
            $total = $order->items->sum(fn($i) => $i->pivot->quantity * $i->pivot->price);
            $order->update(['total' => $total]);
        });
    }
}
