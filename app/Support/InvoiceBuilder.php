<?php

namespace App\Support;

use App\Models\Customer;
use App\Models\Item;
use App\Models\Order;
use Brick\Money\Money;
use Elegantly\Invoices\Models\Invoice as InvoiceModel;
use Elegantly\Invoices\Models\InvoiceItem as InvoiceItemModel;
use InvalidArgumentException;


/**
 * Fluent builder for creating Invoices and lines.
 *
 * Usage:
 * ```
 *      $invoice = app(InvoiceBuilder::class)
 *          ->setInvoiceable($order)
 *          ->setBuyer($customer)
 *          ->setSerial('ORD', $customer->id)
 *          ->addItem($item, $quantity)
 *          ->create();
 * ```
 */
class InvoiceBuilder
{
    public function __construct(
        private LocaleManager $locales,
    ) {
    }

    protected ?Order $order = null;
    protected ?Customer $buyer = null;
    protected ?string $locale = null;

    protected ?string $serialPrefix = null;
    protected string|int|null $serialSerie = null;

    /** @var list<array{item: Item, quantity: int, unit_price: float}> */
    protected array $lines = [];

    public function setInvoiceable(Order $order): self
    {
        $this->order = $order;
        return $this;
    }

    public function setBuyer(Customer $buyer): self
    {
        $this->buyer = $buyer;
        return $this;
    }

    /** Explicitly set a locale (e.g. 'fil_PH', 'en_SG'). */
    public function withLocale(?string $locale): self
    {
        $this->locale = $locale;
        return $this;
    }

    public function setSerial(string $prefix, string|int $serie): self
    {
        $this->serialPrefix = $prefix;
        $this->serialSerie = $serie;
        return $this;
    }

    public function addItem(Item $item, int $quantity, ?float $unitPrice = null): self
    {
        if ($quantity <= 0) {
            throw new InvalidArgumentException("Quantity must be a positive integer.");
        }

        $this->lines[] = [
            'item' => $item,
            'quantity' => $quantity,
            'unit_price' => (float) ($unitPrice ?? $item->price),
        ];

        return $this;
    }

    public function create(): InvoiceModel
    {
        if ($this->order === null) {
            throw new InvalidArgumentException("Invoiceable order is required.");
        }

        if ($this->buyer === null) {
            throw new InvalidArgumentException("Buyer is required.");
        }

        $this->applyLocaleContext();

        $invoice = new InvoiceModel([
            'type' => 'invoice',
            'state' => 'paid',
            'state_set_at' => now(),
            'seller_information' => config('invoices.default_seller'),
            'buyer_information' => [
                'name' => $this->buyer->name,
                'email' => $this->buyer->email,
            ],
            'description' => 'Order #' . $this->order->id,
            'due_at' => now(),
        ]);

        if ($this->serialPrefix !== null && $this->serialSerie !== null) {
            $invoice->configureSerialNumber(prefix: $this->serialPrefix, serie: $this->serialSerie);
        }

        $invoice->buyer()->associate($this->buyer);
        $invoice->invoiceable()->associate($this->order);
        $invoice->save();

        $currency = config('invoices.default_currency', 'USD');

        if ($this->lines !== []) {
            $invoice->items()->saveMany(array_map(function ($line) use ($currency) {
                return new InvoiceItemModel([
                    'label' => $line['item']->name,
                    'description' => $line['item']->description,
                    'unit_price' => Money::of($line['unit_price'], $currency),
                    'tax_percentage' => 0.0,
                    'quantity' => $line['quantity'],
                ]);
            }, $this->lines));
        }

        $invoice->refresh();

        return tap($invoice, fn () => $this->reset());
    }

    private function applyLocaleContext(): void
    {
        if (is_string($this->locale)) {
            $this->locales->applyFromLocale($this->locale);
            return;
        }

        $buyerLocale = method_exists($this->buyer, 'locale') ? (string) ($this->buyer->locale ?? '') : '';
        if ($buyerLocale !== '') {
            $this->locales->applyFromLocale($buyerLocale);
            return;
        }
    }

    public function reset(): self
    {
        $this->order = null;
        $this->buyer = null;
        $this->locale = null;
        $this->serialPrefix = null;
        $this->serialSerie = null;
        $this->lines = [];
        return $this;
    }
}
