import { Order } from '@/types';
import { useForm } from '@inertiajs/react';

export default function OrderShow({ order }: { order: Order }) {
    return (
        <div className="p-6">
            <h1 className="mb-4 text-2xl font-bold">Order #{order.id}</h1>
            <div className="mb-2 text-gray-700">
                Status: <strong>{order.status}</strong>
            </div>

            <table className="mb-4 w-full table-auto">
                <thead>
                    <tr className="text-left">
                        <th className="p-2">Item</th>
                        <th className="p-2">Qty</th>
                        <th className="p-2">Price</th>
                        <th className="p-2">Line</th>
                        <th className="p-2"></th>
                    </tr>
                </thead>
                <tbody>
                    {order.items.map((it) => (
                        <OrderLineRow
                            key={it.id}
                            orderId={order.id}
                            itemId={it.id}
                            name={it.name}
                            price={it.price}
                            quantity={it.quantity}
                            total={it.total}
                        />
                    ))}
                </tbody>
            </table>

            <div className="text-right text-lg font-semibold">Total: ${order.total.toFixed(2)}</div>
        </div>
    );
}

function OrderLineRow({
    orderId,
    itemId,
    name,
    price,
    quantity,
    total,
}: {
    orderId: number;
    itemId: number;
    name: string;
    price: number;
    quantity: number;
    total: number;
}) {
    const { data, setData, put, processing } = useForm({ itemId, quantity });

    return (
        <tr className="border-t">
            <td className="p-2">{name}</td>
            <td className="p-2">{quantity}</td>
            <td className="p-2">${Number(price).toFixed(2)}</td>
            <td className="p-2">${Number(total).toFixed(2)}</td>
            <td className="p-2">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        put(route('customer.orders.update', orderId), { preserveScroll: true });
                    }}
                >
                    <input
                        type="number"
                        name="quantity"
                        min={0}
                        value={data.quantity}
                        onChange={(e) => setData('quantity', e.target.valueAsNumber)}
                        className="mr-2 w-20 rounded border p-1"
                    />
                    <button disabled={processing} className="rounded bg-yellow-500 px-3 py-1 text-white disabled:opacity-50">
                        Update
                    </button>
                </form>
            </td>
        </tr>
    );
}
