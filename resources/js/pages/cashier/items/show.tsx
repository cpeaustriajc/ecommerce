import { Item } from '@/types';
import { Link } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';

export default function ShowItemPage({ item }: { item: Item }) {
    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 py-6 max-w-2xl">
                <div className="mb-6 flex items-center gap-4">
                    <div className="flex-shrink-0">
                        <Button asChild size="sm">
                            <Link href="/cashier/items" className="flex items-center gap-2">
                                <ArrowLeftIcon className="w-4 h-4" />
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
                        <div className="flex items-center justify-between w-full">
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
                            <div className="text-gray-700 leading-relaxed">{item.description}</div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
