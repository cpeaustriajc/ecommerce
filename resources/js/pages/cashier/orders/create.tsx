import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Link, useForm, Head } from '@inertiajs/react';
import { ArrowLeft, Package, Plus, ShoppingCart, Trash2 } from 'lucide-react';
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
        <DashboardLayout>
            <Head title="Create Order" />
            <div className="container mx-auto px-4 py-6">
                <div className="mb-6 flex items-center gap-4">
                    <Button asChild variant="outline" size="sm">
                        <Link href="/cashier/orders">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Orders
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Create Order</h1>
                        <p className="text-sm text-muted-foreground">Add a new order to the system</p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5" />
                                Order Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Customer</Label>
                                    <Select
                                        value={data.customer_id === null ? 'none' : String(data.customer_id)}
                                        onValueChange={(v) => setData('customer_id', v === 'none' ? null : Number(v))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="— None —" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">— None —</SelectItem>
                                            {customers.map((c) => (
                                                <SelectItem key={c.id} value={String(c.id)}>
                                                    {c.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.customer_id && <p className="text-sm text-red-600">{errors.customer_id}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select value={data.status} onValueChange={(v) => setData('status', v as OrderStatus)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statuses.map((s) => (
                                                <SelectItem key={s} value={s}>
                                                    {s}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.status && <p className="text-sm text-red-600">{errors.status}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex w-full items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Items
                                </CardTitle>
                                <Button type="button" variant="outline" size="sm" onClick={addLine}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Line
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {lines.map((line, idx) => {
                                return (
                                    <div key={idx} className="space-y-4">
                                        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
                                            <div className="flex-1 space-y-2">
                                                <Label>Item</Label>
                                                <Select
                                                    value={String(line.item_id)}
                                                    onValueChange={(v) => {
                                                        const itemId = Number(v);
                                                        const it = items.find((i) => i.id === itemId);
                                                        updateLine(idx, { item_id: itemId, price: it?.price ?? 0 });
                                                    }}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {items.map((it) => (
                                                            <SelectItem key={it.id} value={String(it.id)}>
                                                                {it.name} (${it.price.toFixed(2)})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="w-24 space-y-2">
                                                <Label>Qty</Label>
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    value={line.quantity}
                                                    onChange={(e) => updateLine(idx, { quantity: Number(e.target.value) || 1 })}
                                                    className="text-center"
                                                />
                                            </div>

                                            <div className="w-32 space-y-2">
                                                <Label>Line Total</Label>
                                                <div className="flex h-10 items-center justify-end font-semibold">
                                                    ${(line.price * line.quantity).toFixed(2)}
                                                </div>
                                            </div>

                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeLine(idx)}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span className="sr-only">Remove</span>
                                            </Button>
                                        </div>
                                        {idx < lines.length - 1 && <Separator />}
                                    </div>
                                );
                            })}

                            {errors['items'] && <p className="text-sm text-red-600">{errors['items']}</p>}

                            <Separator />
                            <div className="flex items-center justify-between pt-4">
                                <span className="text-lg font-semibold">Total</span>
                                <span className="text-xl font-bold">${lines.reduce((sum, l) => sum + l.price * l.quantity, 0).toFixed(2)}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-4">
                        <Button type="submit" className="flex-1 sm:flex-none" disabled={processing}>
                            Create Order
                        </Button>
                        <Button type="button" variant="outline" asChild className="flex-1 sm:flex-none">
                            <Link href="/cashier/orders">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
