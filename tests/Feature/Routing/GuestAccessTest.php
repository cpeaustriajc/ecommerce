<?php

use function Pest\Laravel\get;

it('guest can access login and register pages', function () {
    get(route('customer.login'))->assertOk();
    get(route('customer.register'))->assertOk();
    get(route('cashier.login'))->assertOk();
    get(route('cashier.register'))->assertOk();
});
