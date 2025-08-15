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
        $perPage = (int) $request->input('per_page', 10);
        $paginator = Item::query()
            ->whereMonth('created_at', now()->month)
            ->orderByDesc('created_at')
            ->paginate($perPage)
            ->withQueryString();

        $data = $paginator->toArray();

        return Inertia::render('storefront', [
            'items' => $data['data'],
            'links' => $data['links'],
            'meta' => [
                'current_page' => $data['current_page'],
                'last_page' => $data['last_page'],
                'per_page' => $data['per_page'],
                'total' => $data['total'],
            ],
        ]);
    }

    public function show(Item $item): Response
    {
        return Inertia::render('items/show', compact('item'));
    }
}
