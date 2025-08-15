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
        Customer::factory(20)->create();
        Cashier::factory(5)->create();
        Item::factory(20)->create();
        Order::factory(10)->create();
    }
}
