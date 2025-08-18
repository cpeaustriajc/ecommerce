<?php

use Elegantly\Invoices\Models\Invoice;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Invoice::query()
            ->chunkById(1_000, function (Collection $invoices) {
                /** @var Collection<int, Invoice> $invoices */
                foreach ($invoices as $invoice) {
                    Model::withoutTimestamps(
                        fn () => $invoice
                            ->denormalizeSerialNumber()
                            ->saveQuietly()
                    );
                }
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
