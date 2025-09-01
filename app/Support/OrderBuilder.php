<?php

namespace App\Support;

use App\Enums\OrderStatus;
use App\Models\Cashier;
use App\Models\Customer;
use App\Models\Item;
use App\Models\Order;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

/**
 * Fluent builder for creating Orders with items.
 *
 * Usage:
 * ```
 *  $order = app(OrderBuilder::class)
 *      ->forCustomer($customer)
 *      ->byCashier($cashier)
 *      ->withStatus(OrderStatus::Pending)
 *      ->addItem($item, $quantity)
 *      ->create();
 * ```
 */
class OrderBuilder
{
    protected ?Customer $customer = null;

    protected ?Cashier $cashier = null;

    protected ?OrderStatus $status = null;

    /** @var array<int, array{quantity:int, price:float}> */
    protected array $items = [];

    public function forCustomer(Customer $customer): self
    {
        $this->customer = $customer;

        return $this;
    }

    public function byCashier(?Cashier $cashier): self
    {
        $this->cashier = $cashier;

        return $this;
    }

    public function withStatus(OrderStatus $status): self
    {
        $this->status = $status;

        return $this;
    }

    /**
     * @param  Item|int  $item  Item model or Item ID
     */
    public function addItem(Item|int $item, int $quantity, ?float $unitPrice = null): self
    {
        if ($quantity <= 0) {
            throw new InvalidArgumentException('Quantity must be a positive integer.');
        }

        $itemId = $item instanceof Item ? (int) $item->id : (int) $item;

        if ($unitPrice === null) {
            $model = $item instanceof Item ? $item : Item::query()->select(['id', 'price'])->findOrFail($itemId);
            $unitPrice = (float) $model->price;
        }

        $this->items[$itemId] = [
            'quantity' => $quantity,
            'price' => (float) $unitPrice,
        ];

        return $this;
    }

    /**
     * Creates and persist the Order with its items in a transaction.
     */
    public function create(): Order
    {
        if ($this->customer === null) {
            throw new InvalidArgumentException('Customer is required.');
        }

        if ($this->status === null) {
            $this->status = OrderStatus::Pending;
        }

        if (empty($this->items)) {
            throw new InvalidArgumentException('At least one item is required to create an order.');
        }

        /** @var Order $order */
        $order = DB::transaction(function (): Order {
            $order = Order::create([
                'customer_id' => $this->customer?->id,
                'cashier_id' => $this->cashier?->id,
                'status' => $this->status,
                'total' => 0,
            ]);

            $order->items()->attach($this->items);
            $order->refresh()->recalculateTotal();

            return $order;
        });

        $this->reset();

        return $order;
    }

    public function reset(): self
    {
        $this->customer = null;
        $this->cashier = null;
        $this->status = null;
        $this->items = [];

        return $this;
    }
}
