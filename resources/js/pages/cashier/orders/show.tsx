import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeftIcon } from 'lucide-react';

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
        <DashboardLayout>
            <Head title={`Order #${order.id}`} />
            <div className="container mx-auto px-4 py-6">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                            <Button asChild size="sm">
                                <Link href="/cashier/orders" className="flex items-center gap-2">
                                    <ArrowLeftIcon className="h-4 w-4" />
                                    Back
                                </Link>
                            </Button>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Order #{order.id}</h1>
                            <p className="text-sm text-muted-foreground">Order details</p>
                        </div>
                    </div>
                    <Button asChild>
                        <Link href={`/cashier/orders/${order.id}/edit`}>Edit</Link>
                    </Button>
                </div>

                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg capitalize">{order.status}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Total</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg">${order.total.toFixed(2)}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Created</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg">{new Date(order.created_at).toLocaleString()}</div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Customer</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div>{order.customer?.name ?? '—'}</div>
                    </CardContent>
                </Card>

                <h2 className="mt-6 mb-2 text-xl font-semibold">Items</h2>
                <Card>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead className="text-right">Qty</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead className="text-right">Line Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {order.items.map((it) => (
                                    <TableRow key={it.id}>
                                        <TableCell>{it.name}</TableCell>
                                        <TableCell className="text-right">{it.quantity}</TableCell>
                                        <TableCell className="text-right">${it.price.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">${it.total.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* back link moved to top - removed duplicate link */}
            </div>
        </DashboardLayout>
    );
}
