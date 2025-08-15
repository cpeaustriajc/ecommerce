import { Link } from '@inertiajs/react';

type OrderStatus = 'pending' | 'completed' | 'cancelled';

type Pivot = { quantity: number; price: number };
type OrderItem = { id: number; name: string; pivot: Pivot };

type OrderListItem = {
    id: number;
    status: OrderStatus;
    total: number;
    created_at: string;
    items?: OrderItem[];
    customer?: { id: number; name: string } | null;
    cashier?: { id: number; name: string } | null;
};

type Pagination<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
};

export default function CashierOrdersIndex({ orders }: { orders: Pagination<OrderListItem> }) {
    return (
        <div className="p-4">
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Orders</h1>
                <Link href="/cashier/orders/create" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                    New Order
                </Link>
            </div>

            <table className="w-full border">
                <thead>
                    <tr className="bg-gray-50">
                        <th className="px-3 py-2 text-left">ID</th>
                        <th className="px-3 py-2 text-left">Customer</th>
                        <th className="px-3 py-2 text-left">Status</th>
                        <th className="px-3 py-2 text-left">Total</th>
                        <th className="px-3 py-2 text-left">Created</th>
                        <th className="px-3 py-2 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.data.map((o) => (
                        <tr key={o.id} className="border-t">
                            <td className="px-3 py-2">{o.id}</td>
                            <td className="px-3 py-2">{o.customer?.name ?? '—'}</td>
                            <td className="px-3 py-2 capitalize">{o.status}</td>
                            <td className="px-3 py-2">${o.total.toFixed(2)}</td>
                            <td className="px-3 py-2">{new Date(o.created_at).toLocaleString()}</td>
                            <td className="space-x-3 px-3 py-2">
                                <Link href={`/cashier/orders/${o.id}`} className="text-blue-600 hover:underline">
                                    Show
                                </Link>
                                <Link href={`/cashier/orders/${o.id}/edit`} className="text-blue-600 hover:underline">
                                    Edit
                                </Link>
                                <Link href={`/cashier/orders/${o.id}`} method="delete" as="button" className="text-red-600 hover:underline">
                                    Delete
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
