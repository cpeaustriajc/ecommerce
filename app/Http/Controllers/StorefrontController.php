<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StorefrontController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): Response
    {
        $items = Item::query()->whereMonth('created_at', now()->month)->get();

        return Inertia::render('storefront', compact('items'));
    }
}
