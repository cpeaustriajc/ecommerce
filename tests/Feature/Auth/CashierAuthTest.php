<?php

use App\Models\Cashier;

use function Pest\Laravel\post;

it('registers a cashier and logs them in', function () {
    $response = post(route('cashier.register.submit'), [
        'name' => 'Cashier A',
        'email' => 'cashier@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertRedirect(route('cashier.dashboard'));
    $this->assertDatabaseHas('cashiers', ['email' => 'cashier@example.com']);
});

it('logs in a cashier with correct credentials', function () {
    $cashier = Cashier::factory()->create(['password' => 'password']);

    $response = post(route('cashier.login.submit'), [
        'email' => $cashier->email,
        'password' => 'password',
    ]);

    $response->assertRedirect(route('cashier.dashboard'));
});
