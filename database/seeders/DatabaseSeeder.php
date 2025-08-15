<?php

namespace Database\Seeders;

use App\Models\Cashier;
use App\Models\Customer;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Item;
use App\Models\Order;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Customer::factory(50)->create();
        Cashier::factory(10)->create();

        $days = 60;
        for ($i = 0; $i < 200; $i++) {
            $start = sprintf('-%d days', rand(0, $days));
            Item::factory()->createdBetween($start, 'now')->create();
        }

        // Ensure each customer has some orders (1-10 each)
        $customers = Customer::all();
        $days = 90;
        foreach ($customers as $customer) {
            $ordersForCustomer = rand(1, 10);
            for ($j = 0; $j < $ordersForCustomer; $j++) {
                $start = sprintf('-%d days', rand(0, $days));
                Order::factory()->createdBetween($start, 'now')->create([
                    'customer_id' => $customer->id,
                ]);
            }
        }

        // Add some extra random orders to increase dataset variety
        $extraOrderCount = 200;
        for ($i = 0; $i < $extraOrderCount; $i++) {
            $start = sprintf('-%d days', rand(0, $days));
            Order::factory()->createdBetween($start, 'now')->create();
        }
    }
}
