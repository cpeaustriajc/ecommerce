import { Badge, getItemIcon, getStatusIcon, getStatusVariant } from '@/components/orders/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PaginationFromLaravel } from '@/components/ui/pagination';
import { Separator } from '@/components/ui/separator';
import SiteLayout from '@/layouts/site-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeftIcon, CalendarIcon, CreditCardIcon, Eye, PackageIcon, XCircleIcon } from 'lucide-react';
import React from 'react';

type OrderListItem = {
    id: number | string;
    status: string;
    total: number;
    created_at: string;
    items?: Array<{
        id: number | string;
        name?: string;
        pivot: { quantity: number; price: number };
    }>;
};

type PaginatedOrders = {
    data: Array<OrderListItem>;
    links?: { url: string | null; label: string; active: boolean }[];
    meta?: { current_page?: number; last_page?: number; per_page?: number; total?: number };
};

export default function OrdersIndex({ orders }: { orders: PaginatedOrders }) {
    const { delete: destroy, processing: deleting } = useForm();
    const [deleteOpen, setDeleteOpen] = React.useState(false);
    const [selectedOrderId, setSelectedOrderId] = React.useState<number | string | null>(null);

    const handleNavigate = (url?: string | null) => {
        if (!url) return;
        router.visit(url, { preserveState: true, preserveScroll: true });
    };

    return (
        <>
            <Head title="My Orders" />
            <div className="container mx-auto max-w-4xl px-4 py-6">
                <div className="mb-6">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={route('storefront.index')}>
                            <ArrowLeftIcon className="mr-2 size-4" />
                            Back to Storefront
                        </Link>
                    </Button>
                </div>
                <h1 className="mb-4 text-2xl font-bold">My Orders</h1>
                <ul className="space-y-3">
                    {orders.data.map((order) => (
                        <Card key={order.id} className="overflow-hidden">
                            <CardHeader className="pb-4">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex flex-row gap-2 sm:items-center sm:gap-4">
                                        <PackageIcon className="size-5 text-muted-foreground" />
                                        <span className="font-semibold">Order #{order.id}</span>
                                        <Badge variant={getStatusVariant(order.status)} className="flex items-center gap-1">
                                            {getStatusIcon(order.status)}
                                            <span className="capitalize">{order.status}</span>
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={route('customer.orders.show', order.id)}>
                                                <Eye className="size-4" />
                                                Details
                                            </Link>
                                        </Button>
                                        <>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedOrderId(order.id);
                                                    setDeleteOpen(true);
                                                }}
                                            >
                                                <XCircleIcon className="size-4" />
                                                Delete
                                            </Button>

                                            <Dialog open={deleteOpen} onOpenChange={(open) => setDeleteOpen(open)}>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Delete order</DialogTitle>
                                                        <DialogDescription>
                                                            This action cannot be undone. Are you sure you want to delete this order?
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <DialogFooter>
                                                        <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            onClick={() => {
                                                                if (!selectedOrderId) return;
                                                                destroy(route('customer.orders.destroy', selectedOrderId), {
                                                                    preserveState: false,
                                                                    onSuccess: () => setDeleteOpen(false),
                                                                });
                                                            }}
                                                            disabled={deleting}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
                                    <div className="flex items-center gap-2">
                                        <CalendarIcon className="size-4" />
                                        <span>Ordered {new Date(order.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CreditCardIcon className="size-4reditCard" />
                                        <div className="font-semibold">${order.total.toFixed(2)}</div>
                                    </div>
                                </div>
                            </CardHeader>
                            <Separator />
                            <CardContent className="pt-4">
                                <div className="space-y-3">
                                    {order.items?.map((item) => (
                                        <div key={item.id} className="flex items-start gap-3 sm:items-center sm:gap-4">
                                            <div className="flex size-12 flex-shrink-0 items-center justify-center rounded-md border bg-muted">
                                                {getItemIcon()}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium sm:text-base">{item.name}</p>
                                                <p className="text-xs text-muted-foreground sm:text-sm">
                                                    {item.pivot.quantity} x ${item?.pivot.price.toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="flex-shrink-0 text-right">
                                                <p className="text-sm font-semibold sm:text-base">
                                                    ${(item.pivot.quantity * item.pivot.price).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </ul>

                <div className="mt-6 flex items-center justify-center">
                    <PaginationFromLaravel links={orders.links ?? []} onNavigate={handleNavigate} />
                </div>
            </div>
        </>
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(OrdersIndex as any).layout = (page: React.ReactNode) => <SiteLayout>{page}</SiteLayout>;
