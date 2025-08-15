<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Order;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CashierDashboardController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Order::class);

        $start7 = now()->subDays(6)->startOfDay();
        $rows7 = Order::query()
            ->where('created_at', '>=', $start7)
            ->selectRaw('DATE(created_at) as date, SUM(total) as total')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $dates7 = [];
        for ($i = 6; $i >= 0; $i--) {
            $dates7[] = now()->subDays($i)->toDateString();
        }

        $chart7 = array_map(function ($d) use ($rows7) {
            $found = $rows7->get($d);

            return [
                'date' => $d,
                'total' => $found->total ?? 0,
            ];
        }, $dates7);

        $start30 = now()->subDays(29)->startOfDay();
        $rows30 = Order::query()
            ->where('created_at', '>=', $start30)
            ->selectRaw('DATE(created_at) as date, SUM(total) as total')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $dates30 = [];
        for ($i = 29; $i >= 0; $i--) {
            $dates30[] = now()->subDays($i)->toDateString();
        }

        $chart30 = array_map(function ($d) use ($rows30) {
            $found = $rows30->get($d);

            return ['date' => $d, 'total' => $found->total ?? 0];
        }, $dates30);

        $itemsRows = Item::query()
            ->where('created_at', '>=', $start30)
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $itemsCreated = array_map(function ($d) use ($itemsRows) {
            $found = $itemsRows->get($d);

            return ['date' => $d, 'count' => $found->count ?? 0];
        }, $dates30);

        $orderedRows = DB::table('order_item')
            ->join('orders', 'order_item.order_id', '=', 'orders.id')
            ->where('orders.created_at', '>=', $start30)
            ->selectRaw('DATE(orders.created_at) as date, SUM(order_item.quantity) as qty')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $itemsOrdered = array_map(function ($d) use ($orderedRows) {
            $found = $orderedRows->get($d);

            return ['date' => $d, 'qty' => $found->qty ?? 0];
        }, $dates30);

        return Inertia::render('cashier/dashboard', [
            'chart7' => $chart7,
            'chart30' => $chart30,
            'itemsCreated' => $itemsCreated,
            'itemsOrdered' => $itemsOrdered,
        ]);
    }
}
