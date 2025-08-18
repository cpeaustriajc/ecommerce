<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ItemSubscriptionController extends Controller
{
    public function subscribe(Request $request, Item $item): RedirectResponse
    {
        /** @var \App\Models\Customer $customer */
        $customer = $request->user('customer');

        $customer->subscribedItems()->syncWithoutDetaching([$item->id]);

        return back()->with('success', 'Subscribed to item updates.');
    }

    public function unsubscribe(Request $request, Item $item): RedirectResponse
    {
        /** @var \App\Models\Customer $customer */
        $customer = $request->user('customer');

        $customer->subscribedItems()->detach($item->id);

        return back()->with('success', 'Unsubscribed from item updates.');
    }
}
