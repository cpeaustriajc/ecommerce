import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Item } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeftIcon } from 'lucide-react';

export default function ShowItemPage({ item }: { item: Item }) {
    return (
        <DashboardLayout>
            <Head title={item.name ? `${item.name} — Item` : 'Item Details'} />
            <div className="container mx-auto max-w-2xl px-4 py-6">
                <div className="mb-6 flex items-center gap-4">
                    <div className="flex-shrink-0">
                        <Button asChild size="sm">
                            <Link href="/cashier/items" className="flex items-center gap-2">
                                <ArrowLeftIcon className="h-4 w-4" />
                                Back
                            </Link>
                        </Button>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Item Details</h1>
                        <p className="text-sm text-muted-foreground">View item information</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex w-full items-center justify-between">
                            <CardTitle>{item.name}</CardTitle>
                            <Button asChild>
                                <Link href={`/cashier/items/${item.id}/edit`}>Edit Item</Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <div className="text-sm text-gray-500">ID</div>
                            <Badge variant="outline">{item.id}</Badge>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Price</div>
                            <div className="text-2xl font-bold text-green-600">${item.price.toFixed(2)}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Description</div>
                            <div className="leading-relaxed text-gray-700">{item.description}</div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
