import { Link } from '@inertiajs/react';

export default function CashierOrdersShow({
    order,
}: {
    order: {
        id: number;
        status: string;
        total: number;
        created_at: string;
        customer?: { id: number; name: string } | null;
        cashier?: { id: number; name: string } | null;
        items: { id: number; name: string; price: number; quantity: number; total: number }[];
    };
}) {
    return (
        <div className="p-4">
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Order #{order.id}</h1>
                <Link href={`/cashier/orders/${order.id}/edit`} className="rounded bg-blue-600 px-4 py-2 text-white">
                    Edit
                </Link>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded border p-3">
                    <div className="text-sm text-gray-500">Status</div>
                    <div className="text-lg capitalize">{order.status}</div>
                </div>
                <div className="rounded border p-3">
                    <div className="text-sm text-gray-500">Total</div>
                    <div className="text-lg">${order.total.toFixed(2)}</div>
                </div>
                <div className="rounded border p-3">
                    <div className="text-sm text-gray-500">Created</div>
                    <div className="text-lg">{new Date(order.created_at).toLocaleString()}</div>
                </div>
            </div>

            <div className="mb-6">
                <div className="text-sm text-gray-500">Customer</div>
                <div>{order.customer?.name ?? '—'}</div>
            </div>

            <h2 className="mb-2 text-xl font-semibold">Items</h2>
            <table className="w-full border">
                <thead>
                    <tr className="bg-gray-50">
                        <th className="px-3 py-2 text-left">Name</th>
                        <th className="px-3 py-2 text-right">Qty</th>
                        <th className="px-3 py-2 text-right">Price</th>
                        <th className="px-3 py-2 text-right">Line Total</th>
                    </tr>
                </thead>
                <tbody>
                    {order.items.map((it) => (
                        <tr key={it.id} className="border-t">
                            <td className="px-3 py-2">{it.name}</td>
                            <td className="px-3 py-2 text-right">{it.quantity}</td>
                            <td className="px-3 py-2 text-right">${it.price.toFixed(2)}</td>
                            <td className="px-3 py-2 text-right">${it.total.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-4">
                <Link href="/cashier/orders" className="text-gray-700">
                    Back to list
                </Link>
            </div>
        </div>
    );
}
