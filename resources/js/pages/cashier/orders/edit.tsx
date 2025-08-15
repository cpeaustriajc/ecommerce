import { Link, useForm } from '@inertiajs/react';

type OrderStatus = 'pending' | 'completed' | 'cancelled';

export default function CashierOrdersEdit({
    order,
    statuses,
}: {
    order: { id: number; status: OrderStatus; total: number };
    statuses: OrderStatus[];
}) {
    const { data, setData, put, processing, errors } = useForm<{ status: OrderStatus }>({
        status: order.status,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/cashier/orders/${order.id}`);
    };

    return (
        <div className="p-4">
            <h1 className="mb-4 text-2xl font-bold">Edit Order #{order.id}</h1>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="mb-1 block">Status</label>
                    <select
                        className="w-full rounded border px-3 py-2"
                        value={data.status}
                        onChange={(e) => setData('status', e.target.value as OrderStatus)}
                    >
                        {statuses.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                    {errors.status && <p className="text-sm text-red-600">{errors.status}</p>}
                </div>

                <div className="flex items-center gap-3">
                    <button type="submit" disabled={processing} className="rounded bg-blue-600 px-4 py-2 text-white">
                        Save
                    </button>
                    <Link href="/cashier/orders" className="text-gray-700">
                        Back
                    </Link>
                </div>
            </form>
        </div>
    );
}
