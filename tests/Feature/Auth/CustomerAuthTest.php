<?php

use App\Models\Customer;

use function Pest\Laravel\post;

it('registers a customer and logs them in', function () {
    $response = post(route('customer.register.submit'), [
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertRedirect(route('storefront.index'));
    $this->assertDatabaseHas('customers', ['email' => 'jane@example.com']);
});

it('logs in a customer with correct credentials', function () {
    $customer = Customer::factory()->create(['password' => 'password']);

    $response = post(route('customer.login.submit'), [
        'email' => $customer->email,
        'password' => 'password',
    ]);

    $response->assertRedirect(route('storefront.index'));
});
