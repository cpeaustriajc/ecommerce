<?php

namespace App\Mail;

use App\Models\Order;
use Elegantly\Invoices\Models\Invoice;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OrderReceipt extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Order $order,
        public Invoice $invoice,
    ) {}

    public function build(): self
    {
        return $this
            ->subject('Your Receipt for Order #'.$this->order->id)
            ->view('emails.order-receipt')
            ->with([
                'order' => $this->order,
                'invoice' => $this->invoice,
            ])
            ->attach($this->invoice->toMailAttachment());
    }
}
