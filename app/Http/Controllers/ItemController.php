<?php

namespace App\Http\Controllers;

use App\Events\ItemNotification;
use App\Events\ItemPriceUpdated;
use App\Http\Requests\StoreItemRequest;
use App\Http\Requests\UpdateItemRequest;
use App\Models\Item;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ItemController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Item::class);

        $q = $request->input('q');
        $sort = $request->input('sort');
        $direction = $request->input('direction', 'desc');

        $paginator = Item::query()
            ->when($q, function ($query, $q) {
                $query->where('name', 'like', "%{$q}%")
                    ->orWhere('description', 'like', "%{$q}%");
            })
            ->when($sort, function ($query, $sort) use ($direction) {
                // allow only specific sortable columns for safety
                if (in_array($sort, ['name', 'price', 'created_at'])) {
                    $query->orderBy($sort, $direction);

                    return;
                }
                $query->orderBy('created_at', 'desc');
            }, function ($query) {
                $query->orderBy('created_at', 'desc');
            })
            ->paginate(10)
            ->withQueryString();

        $data = $paginator->toArray();

        return Inertia::render('cashier/items/index', [
            'items' => $data['data'],
            'links' => $data['links'],
            'filters' => [
                'q' => $q,
                'sort' => $sort,
                'direction' => $direction,
            ],
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Item::class);

        return Inertia::render('cashier/items/create');
    }

    public function store(StoreItemRequest $request): RedirectResponse
    {
        $this->authorize('create', Item::class);
        $item = new Item;
        $item->name = $request->validated('name');
        $item->price = $request->validated('price');
        $item->description = $request->validated('description');
        $item->save();

        return redirect()->route('cashier.items.index')->with('success', 'Item created successfully.');
    }

    public function show(Item $item): Response
    {
        $this->authorize('view', $item);

        return Inertia::render('cashier/items/show', [
            'item' => $item,
        ]);
    }

    public function edit(Item $item): Response
    {
        $this->authorize('update', $item);

        return Inertia::render('cashier/items/edit', [
            'item' => $item,
        ]);
    }

    public function update(UpdateItemRequest $request, Item $item): RedirectResponse
    {
        $this->authorize('update', $item);

        $data = $request->validated();
        $originalPrice = $item->price;
        $item->update($data);

        // Broadcast a general item update notification
        event(new ItemNotification($item, "Item '{$item->name}' has been updated."));

        // If price changed, broadcast price update to public channels
        if (array_key_exists('price', $data) && (float) $originalPrice !== (float) $item->price) {
            event(new ItemPriceUpdated($item));
        }

        return redirect()->route('cashier.items.index')->with('success', 'Item updated successfully.');
    }

    public function destroy(Item $item): RedirectResponse
    {
        $this->authorize('delete', $item);

        $item->delete();

        return redirect()->route('cashier.items.index')->with('success', 'Item deleted successfully.');
    }
}
