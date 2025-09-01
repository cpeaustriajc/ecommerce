<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Http\Requests\StoreCustomerOrderRequest;
use App\Http\Requests\UpdateCustomerOrderRequest;
use App\Mail\OrderReceipt;
use App\Models\Item;
use App\Models\Order;
use App\Support\InvoiceBuilder;
use App\Support\OrderBuilder;
use Brick\Money\Money;
use Elegantly\Invoices\Models\Invoice as InvoiceModel;
use Elegantly\Invoices\Models\InvoiceItem as InvoiceItemModel;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class CustomerOrderController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Order::class);
        $customer = $request->user('customer');
        $orders = Order::query()
            ->where('customer_id', $customer->id)
            ->with([
                'items' => fn(BelongsToMany $q) => $q
                    ->select(['items.id', 'items.name', 'items.price'])
                    ->withPivot(['quantity', 'price']),
            ])
            ->select(['id', 'customer_id', 'cashier_id', 'status', 'total', 'created_at'])
            ->latest()
            ->paginate(2);

        return Inertia::render('customer/orders/index', [
            'orders' => $orders,
        ]);
    }

    public function show(Order $order)
    {
        $this->authorize('view', $order);
        $order->load([
            'items' => fn(BelongsToMany $q) => $q->select([
                'items.id',
                'items.name',
                'items.price',
            ])->withPivot(['quantity', 'price']),
        ]);

        return Inertia::render('customer/orders/show', [
            'order' => [
                'id' => $order->id,
                'status' => $order->status,
                'total' => (float) $order->total,
                'created_at' => $order->created_at,
                'items' => $order->items->map(fn(Item $item) => [
                    'id' => $item->id,
                    'name' => $item->name,
                    'price' => (float) $item->pivot->price,
                    'quantity' => (float) $item->pivot->quantity,
                    'total' => (float) ($item->pivot->quantity * $item->pivot->price),
                ]),
            ],
        ]);
    }

    public function store(StoreCustomerOrderRequest $request, OrderBuilder $orders, InvoiceBuilder $invoices): RedirectResponse
    {
        $this->authorize('create', Order::class);
        $customer = $request->user('customer');
        $item = Item::findOrFail((int) $request->validated('itemId'));
        $quantity = (int) $request->validated('quantity');

        $order = $orders
            ->forCustomer($customer)
            ->byCashier(null)
            ->withStatus(OrderStatus::Pending)
            ->addItem($item, $quantity)
            ->create();

        $invoice = $invoices
            ->setInvoiceable($order)
            ->setBuyer($customer)
            ->setSerial('ORD', $customer->id)
            ->addItem($item, $quantity)
            ->create();

        return redirect()->route('customer.orders.index')
            ->with('success', 'Order created successfully.');
    }

    public function update(UpdateCustomerOrderRequest $request, Order $order): RedirectResponse
    {
        $this->authorize('update', $order);
        $itemId = (int) $request->validated('itemId');
        $quantity = (int) $request->validated('quantity');

        if ($quantity === 0) {
            $order->items()->detach($itemId);
        } else {
            $pivot = $order->items()->where('items.id', $itemId)->first();
            $unitPrice = $pivot ? $pivot->pivot->price : Item::findOrFail($itemId)->price;

            $order->items()->updateExistingPivot($itemId, [
                'quantity' => $quantity,
                'price' => $unitPrice,
            ]);
        }

        $order->recalculateTotal();

        return redirect()->route('customer.orders.index')
            ->with('success', 'Order updated successfully.');
    }

    public function destroy(Order $order): RedirectResponse
    {
        $this->authorize('delete', $order);

        $order->items()->detach();
        $order->delete();

        return redirect()->route('customer.orders.index')
            ->with('success', 'Order deleted successfully.');
    }
}
