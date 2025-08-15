<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Http\Requests\StoreItemRequest;
use App\Http\Requests\UpdateItemRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ItemController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', Item::class);

        return Inertia::render('cashier/items/index', [
            'items' => Item::all(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $this->authorize('create', Item::class);
        return Inertia::render('cashier/items/create');
    }

    public function store(StoreItemRequest $request): RedirectResponse
    {
        $this->authorize('create', Item::class);
        $item = new Item();
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

        $item = Item::findOrFail($item->id);
        $item->name = $request->validated('name');
        $item->price = $request->validated('price');
        $item->description = $request->validated('description');
        $item->save();

        return redirect()->route('cashier.items.index')->with('success', 'Item updated successfully.');
    }

    public function destroy(Item $item): RedirectResponse
    {
        $this->authorize('delete', $item);

        $item->delete();

        return redirect()->route('cashier.items.index')->with('success', 'Item deleted successfully.');
    }
}
