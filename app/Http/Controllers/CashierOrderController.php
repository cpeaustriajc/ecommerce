<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Http\Requests\CashierStoreOrderRequest;
use App\Http\Requests\CashierUpdateOrderRequest;
use App\Models\Customer;
use App\Models\Item;
use App\Models\Order;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CashierOrderController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Order::class);

        $q = $request->query('q');
        $sort = $request->query('sort');
        $direction = $request->query('direction', 'desc');

        $ordersQuery = Order::query()
            ->with([
                'customer:id,name',
                'cashier:id,name',
                'items' => fn(BelongsToMany $q) => $q
                    ->select(['items.id', 'items.name', 'items.price'])
                    ->withPivot(['quantity', 'price']),
            ])
            ->select(['id', 'customer_id', 'cashier_id', 'status', 'total', 'created_at']);

        if ($q) {
            $ordersQuery->where(function ($builder) use ($q) {
                if (is_numeric($q)) {
                    $builder->where('id', (int) $q);
                }

                $builder->orWhere('status', 'like', "%{$q}%");
                $builder->orWhereHas('customer', fn($b) => $b->where('name', 'like', "%{$q}%"));
                $builder->orWhereHas('cashier', fn($b) => $b->where('name', 'like', "%{$q}%"));
            });
        }

        $allowedSorts = ['total', 'created_at', 'id'];
        if ($sort && in_array($sort, $allowedSorts)) {
            $ordersQuery->orderBy($sort, $direction === 'asc' ? 'asc' : 'desc');
        } else {
            $ordersQuery->latest();
        }

        $orders = $ordersQuery->paginate(10)->withQueryString();

        return Inertia::render('cashier/orders/index', [
            'orders' => $orders,
            'filters' => $request->only(['q', 'sort', 'direction']),
        ]);
    }

    public function create()
    {
        $this->authorize('create', Order::class);

        return Inertia::render('cashier/orders/create', [
            'customers' => Customer::query()->select(['id', 'name'])->orderBy('name')->get(),
            'items' => Item::query()->select(['id', 'name', 'price'])->orderBy('name')->get(),
            'statuses' => array_column(OrderStatus::cases(), 'value'),
        ]);
    }

    public function store(CashierStoreOrderRequest $request)
    {
        $this->authorize('create', Order::class);
        $cashier = $request->user('cashier');

        $customer = $request->validated('customer_id');
        $status = OrderStatus::from($request->validated('status'));

        DB::transaction(function () use ($request, $cashier, $customer, $status) {
            $order = Order::create([
                'customer_id' => $customer,
                'cashier_id' => $cashier->id,
                'status' => $status,
                'total' => 0,
            ]);

            $attach = [];
            foreach ($request->validated('items') as $item) {
                $itemId = (int) $item['item_id'];
                $quantity = (int) $item['quantity'];
                $price = (float) $item['price'];
                $attach[$itemId] = [
                    'quantity' => $quantity,
                    'price' => $price,
                ];
            }

            $order->items()->attach($attach);
            $order->recalculateTotal();
        });

        return redirect()->route('cashier.orders.index')
            ->with('success', 'Order created successfully.');
    }

    public function show(Order $order)
    {
        $this->authorize('view', $order);
        $order->load([
            'customer:id,name',
            'cashier:id,name',
            'items' => fn(BelongsToMany $q) => $q
                ->select(['items.id', 'items.name', 'items.price'])
                ->withPivot(['quantity', 'price']),
        ]);

        return Inertia::render('cashier/orders/show', [
            'order' => [
                'id' => $order->id,
                'status' => $order->status,
                'total' => (float) $order->total,
                'created_at' => $order->created_at?->toISOString(),
                'customer' => $order->customer?->only(['id', 'name']),
                'cashier' => $order->cashier?->only(['id', 'name']),
                'items' => $order->items->map(fn(Item $item) => [
                    'id' => $item->id,
                    'name' => $item->name,
                    'price' => (float) $item->pivot->price,
                    'quantity' => (int) $item->pivot->quantity,
                    'total' => (float) ($item->pivot->quantity * $item->pivot->price),
                ]),
            ],
        ]);
    }

    public function edit(Order $order)
    {
        $this->authorize('update', $order);
        $order->load([
            'items' => fn(BelongsToMany $q) => $q
                ->select(['items.id', 'items.name', 'items.price'])
                ->withPivot(['quantity', 'price']),
        ]);

        return Inertia::render('cashier/orders/edit', [
            'order' => [
                'id' => $order->id,
                'status' => $order->status,
                'total' => (float) $order->total,
                'items' => $order->items->map(fn(Item $item) => [
                    'id' => $item->id,
                    'name' => $item->name,
                    'price' => (float) $item->pivot->price,
                    'quantity' => (int) $item->pivot->quantity,
                ]),
            ],
            'statuses' => array_column(OrderStatus::cases(), 'value'),
        ]);
    }

    public function update(CashierUpdateOrderRequest $request, Order $order)
    {
        $this->authorize('update', $order);
        $status = OrderStatus::from($request->validated('status'));
        $order->update(['status' => $status]);

        $order->recalculateTotal();

        return redirect()->route('cashier.orders.index')->with('success', 'Order updated successfully.');
    }

    public function destroy(Order $order)
    {
        $this->authorize('delete', $order);
        DB::transaction(function () use ($order) {
            $order->items()->detach();
            $order->delete();
        });

        return redirect()->route('cashier.orders.index')
            ->with('success', 'Order deleted successfully.');
    }
}
