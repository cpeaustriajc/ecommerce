import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Link, useForm, Head } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

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
        <DashboardLayout>
            <Head title={`Edit Order #${order.id}`} />
            <div className="container mx-auto max-w-2xl px-4 py-6">
                <div className="mb-6 flex items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Edit Order #{order.id}</h1>
                        <p className="text-sm text-muted-foreground">Update order status</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Edit Order</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <Label>Status</Label>
                            <Select value={data.status} onValueChange={(v) => setData('status', v as OrderStatus)}>
                                <SelectTrigger>
                                    <SelectValue className="capitalize" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statuses.map((s) => (
                                        <SelectItem key={s} value={s} className="capitalize">
                                            {s}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.status && <p className="text-sm text-red-600">{errors.status}</p>}

                            <div className="flex gap-4 pt-4">
                                <Button type="submit" disabled={processing} className="flex-1 sm:flex-none">
                                    <Save className="mr-2 h-4 w-4" />
                                    Save
                                </Button>
                                <Button variant="outline" asChild className="flex-1 sm:flex-none">
                                    <Link href="/cashier/orders">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back
                                    </Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
