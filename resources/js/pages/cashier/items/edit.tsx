import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Item } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

export default function EditItemPage({ item }: { item: Item }) {
    const { data, setData, put, processing, errors } = useForm({
        name: item.name,
        description: item.description,
        price: item.price,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(`/cashier/items/${item.id}`, {
            showProgress: true,
        });
    }

    return (
        <DashboardLayout>
            <Head title={item.name ? `Edit Item — ${item.name}` : 'Edit Item'} />
            <div className="container mx-auto max-w-2xl px-4 py-6">
                <div className="mb-6 flex items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Edit Item</h1>
                        <p className="text-sm text-muted-foreground">Update item details</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Edit Item</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={4}
                                />
                                {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="price">Price</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    value={data.price}
                                    onChange={(e) => setData('price', parseFloat(e.target.value) || 0)}
                                    required
                                />
                                {errors.price && <p className="text-sm text-red-600">{errors.price}</p>}
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button type="submit" disabled={processing} className="flex-1 sm:flex-none">
                                    <Save className="mr-2 h-4 w-4" />
                                    Update Item
                                </Button>
                                <Button variant="outline" asChild className="flex-1 sm:flex-none">
                                    <Link href="/cashier/items">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Cancel
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
