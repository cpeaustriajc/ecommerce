import { Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

type OrderStatus = 'pending' | 'completed' | 'cancelled';
type Customer = { id: number; name: string };
type Item = { id: number; name: string; price: number };

type Line = { item_id: number; quantity: number; price: number };

export default function CashierOrdersCreate({ customers, items, statuses }: { customers: Customer[]; items: Item[]; statuses: OrderStatus[] }) {
    const { data, setData, post, processing, errors } = useForm<{
        customer_id: number | null;
        status: OrderStatus;
        items: Line[];
    }>({
        customer_id: null,
        status: 'pending',
        items: [{ item_id: items[0]?.id ?? 0, quantity: 1, price: items[0]?.price ?? 0 }],
    });

    const [lines, setLines] = useState<Line[]>(data.items);

    const updateLine = (idx: number, patch: Partial<Line>) => {
        const next = lines.map((l, i) => (i === idx ? { ...l, ...patch } : l));
        setLines(next);
        setData('items', next);
    };

    const addLine = () => {
        const def = items[0] ?? { id: 0, price: 0, name: '' };
        const next = [...lines, { item_id: def.id, quantity: 1, price: def.price }];
        setLines(next);
        setData('items', next);
    };

    const removeLine = (idx: number) => {
        const next = lines.filter((_, i) => i !== idx);
        setLines(next);
        setData('items', next);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/cashier/orders');
    };

    return (
        <div className="p-4">
            <h1 className="mb-4 text-2xl font-bold">Create Order</h1>
            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="mb-1 block">Customer (optional)</label>
                    <select
                        className="w-full rounded border px-3 py-2"
                        value={data.customer_id ?? ''}
                        onChange={(e) => setData('customer_id', e.target.value ? Number(e.target.value) : null)}
                    >
                        <option value="">— None —</option>
                        {customers.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                    {errors.customer_id && <p className="text-sm text-red-600">{errors.customer_id}</p>}
                </div>

                <div>
                    <label className="mb-1 block">Status</label>
                    <select
                        className="w-full rounded border px-3 py-2 capitalize"
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

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Items</h2>
                        <button type="button" onClick={addLine} className="rounded bg-gray-200 px-3 py-1">
                            Add Line
                        </button>
                    </div>

                    {lines.map((line, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <select
                                className="flex-1 rounded border px-3 py-2"
                                value={line.item_id}
                                onChange={(e) => {
                                    const itemId = Number(e.target.value);
                                    const item = items.find((i) => i.id === itemId);
                                    updateLine(idx, { item_id: itemId, price: item?.price ?? 0 });
                                }}
                            >
                                {items.map((it) => (
                                    <option key={it.id} value={it.id}>
                                        {it.name} (${it.price.toFixed(2)})
                                    </option>
                                ))}
                            </select>
                            <input
                                type="number"
                                min={1}
                                className="w-24 rounded border px-2 py-2"
                                value={line.quantity}
                                onChange={(e) => updateLine(idx, { quantity: Number(e.target.value) })}
                            />
                            <input
                                type="number"
                                min={0}
                                step="0.01"
                                className="w-28 rounded border px-2 py-2"
                                value={line.price}
                                onChange={(e) => updateLine(idx, { price: Number(e.target.value) })}
                            />
                            <button type="button" onClick={() => removeLine(idx)} className="text-red-600">
                                Remove
                            </button>
                        </div>
                    ))}

                    {errors['items'] && <p className="text-sm text-red-600">{errors['items']}</p>}
                </div>

                <div className="flex items-center gap-3">
                    <button type="submit" disabled={processing} className="rounded bg-blue-600 px-4 py-2 text-white">
                        Create
                    </button>
                    <Link href="/cashier/orders" className="text-gray-700">
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
