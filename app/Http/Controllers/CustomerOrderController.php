<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Http\Requests\StoreCustomerOrderRequest;
use App\Http\Requests\UpdateCustomerOrderRequest;
use App\Mail\OrderReceipt;
use App\Models\Item;
use App\Models\Order;
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
                'items' => fn (BelongsToMany $q) => $q
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
            'items' => fn (BelongsToMany $q) => $q->select([
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
                'items' => $order->items->map(fn (Item $item) => [
                    'id' => $item->id,
                    'name' => $item->name,
                    'price' => (float) $item->pivot->price,
                    'quantity' => (float) $item->pivot->quantity,
                    'total' => (float) ($item->pivot->quantity * $item->pivot->price),
                ]),
            ],
        ]);
    }

    public function store(StoreCustomerOrderRequest $request): RedirectResponse
    {
        $this->authorize('create', Order::class);
        $customer = $request->user('customer');

        $item = Item::query()->findOrFail($request->validated('itemId'));
        $quantity = (int) $request->validated('quantity');

        $order = null;
        DB::transaction(function () use ($customer, $item, $quantity, &$order) {
            $order = Order::create([
                'customer_id' => $customer->id,
                'cashier_id' => null,
                'status' => OrderStatus::Pending,
                'total' => 0,
            ]);

            $order->items()->attach([
                $item->id => [
                    'quantity' => $quantity,
                    'price' => $item->price,
                ],
            ]);

            $order->recalculateTotal();

            // Create Invoice model for this order
            /** @var InvoiceModel $invoice */
            $invoice = new InvoiceModel([
                'type' => 'invoice',
                'state' => 'paid',
                'state_set_at' => now(),
                'seller_information' => config('invoices.default_seller'),
                'buyer_information' => [
                    'name' => $customer->name,
                    'email' => $customer->email,
                ],
                'description' => 'Order #'.$order->id,
                'due_at' => now(),
            ]);

            // Configure serial number series by customer id
            $invoice->configureSerialNumber(prefix: 'ORD', serie: $customer->id);

            $invoice->buyer()->associate($customer);
            $invoice->invoiceable()->associate($order);
            $invoice->save();

            // Add invoice item(s) mirroring order items
            $invoice->items()->saveMany([
                new InvoiceItemModel([
                    'label' => $item->name,
                    'description' => $item->description,
                    'unit_price' => Money::of((float) $item->price, config('invoices.default_currency', 'USD')),
                    'tax_percentage' => 0.0,
                    'quantity' => $quantity,
                ]),
            ]);

            // Ensure denormalized totals are computed by the package
            $invoice->refresh();
        });
        // Send receipt email with invoice attached
        if ($order) {
            /** @var InvoiceModel|null $invoiceForMail */
            $invoiceForMail = InvoiceModel::where('invoiceable_type', Order::class)
                ->where('invoiceable_id', $order->id)
                ->latest('id')
                ->first();

            if ($invoiceForMail) {
                Mail::to($customer->email)->send(new OrderReceipt($order, $invoiceForMail));
            }
        }

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
