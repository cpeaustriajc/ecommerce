import Header from '@/components/header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Order } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeftIcon, Package } from 'lucide-react';

const getStatusColor = (status: Order['status']) => {
    switch (status) {
        case 'pending':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'completed':
            return 'bg-green-100 text-green-800 border-green-200';
        case 'cancelled':
            return 'bg-red-100 text-red-800 border-red-200';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

export default function OrderShow({ order }: { order: Order }) {
    return (
        <>
            <Header />
            <div className="container mx-auto max-w-4xl px-4 py-6">
                <div className="mb-6">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={route('customer.orders.index')}>
                            <ArrowLeftIcon className="mr-2 size-4" />
                            Back to Orders
                        </Link>
                    </Button>
                </div>

                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Order #{order.id}</h1>
                            <p className="text-sm text-gray-500">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <Badge className={cn(getStatusColor(order.status), 'capitalize')}>{order.status}</Badge>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Order Items</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {order.items.map((item, index) => (
                            <OrderItemCard key={item.id} orderId={order.id} item={item} index={index} totalItems={order.items.length} />
                        ))}

                        <Separator />
                        <div className="flex items-center justify-between pt-4">
                            <span className="text-lg font-semibold text-gray-900">Total</span>
                            <span className="text-xl font-bold text-gray-900">${order.total.toFixed(2)}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

function OrderItemCard({ orderId, item, index, totalItems }: { orderId: number; item: Order['items'][number]; index: number; totalItems: number }) {
    const { data, setData, put, processing } = useForm({ itemId: item.id, quantity: item.quantity });

    type ItemWithOptionalDescription = typeof item & { description?: string };
    const description = (item as ItemWithOptionalDescription).description;

    return (
        <>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                        <Package className="h-6 w-6 text-gray-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="truncate font-medium text-gray-900">{item.name}</h3>
                        {description && <p className="line-clamp-2 text-sm text-gray-500">{description}</p>}
                        <p className="text-sm font-medium text-gray-900">${Number(item.price).toFixed(2)} each</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 sm:gap-6">
                    <div className="flex flex-none items-center gap-2">
                        <span className="min-w-0 text-sm text-gray-500">Qty:</span>
                        <Input
                            type="number"
                            min={1}
                            value={data.quantity}
                            onChange={(e) => setData('quantity', Number(e.target.value || 0))}
                            className="h-8 w-16 text-center"
                        />
                        <Button
                            size="sm"
                            onClick={() => put(route('customer.orders.update', orderId), { preserveScroll: true })}
                            className="h-8 px-3"
                            disabled={processing}
                        >
                            Update
                        </Button>
                    </div>

                    <div className="w-28 flex-none text-right">
                        <p className="text-sm text-gray-500">Line Total</p>
                        <p className="font-semibold text-gray-900">${(Number(item.price) * Number(data.quantity)).toFixed(2)}</p>
                    </div>
                </div>
            </div>
            {index < totalItems - 1 && <Separator className="mt-4" />}
        </>
    );
}
