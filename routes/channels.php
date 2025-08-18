<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('customer.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
}, ['guards' => ['customer']]);

// Optional: keep legacy model channel if elsewhere referenced
Broadcast::channel('App.Models.Customer.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
}, ['guards' => ['customer']]);
