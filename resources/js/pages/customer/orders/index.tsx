import { OrderListItem } from '@/types';
import { Link, useForm } from '@inertiajs/react';

export default function OrdersIndex({ orders }: { orders: { data: OrderListItem[] } }) {
    const { delete: destroy } = useForm({
        order_id: null,
    });
    console.log(orders);
    return (
        <div className="p-6">
            <h1 className="mb-4 text-2xl font-bold">My Orders</h1>
            <ul className="space-y-3">
                {orders.data.map((o) => (
                    <li key={o.id} className="rounded border p-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-semibold">Order #{o.id}</div>
                                <div className="text-sm text-gray-600">
                                    {o.status} • {o.total.toFixed(2)}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Link href={route('customer.orders.show', o.id)} className="rounded bg-slate-600 px-3 py-1 text-white">
                                    Details
                                </Link>
                                <button
                                    onClick={() => destroy(route('customer.orders.destroy', o.id))}
                                    className="rounded bg-red-500 px-3 py-1 text-white"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
