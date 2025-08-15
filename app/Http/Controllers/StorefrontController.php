<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StorefrontController extends Controller
{
    public function index(Request $request): Response
    {
        $items = Item::query()->whereMonth('created_at', now()->month)->get();

        return Inertia::render('storefront', compact('items'));
    }

    public function show(Item $item): Response
    {
        return Inertia::render('items/show', compact('item'));
    }
}
