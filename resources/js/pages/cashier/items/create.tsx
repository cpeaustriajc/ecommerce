import { useForm } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Link } from '@inertiajs/react';
import { Save, ArrowLeft } from 'lucide-react';

export default function CreateItemPage() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        price: 0,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/cashier/items', {
            showProgress: true,
        });
    }

    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 py-6 max-w-2xl">
                <div className="mb-6 flex items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Create Item</h1>
                        <p className="text-sm text-muted-foreground">Add a new product to the store</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Create Item</CardTitle>
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
                                <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} rows={4} />
                                {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="price">Price</Label>
                                <Input id="price" type="number" step="0.01" value={data.price} onChange={(e) => setData('price', parseFloat(e.target.value) || 0)} required />
                                {errors.price && <p className="text-sm text-red-600">{errors.price}</p>}
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button type="submit" disabled={processing} className="flex-1 sm:flex-none">
                                    <Save className="h-4 w-4 mr-2" />
                                    Create Item
                                </Button>
                                <Button variant="outline" asChild className="flex-1 sm:flex-none">
                                    <Link href="/cashier/items">
                                        <ArrowLeft className="h-4 w-4 mr-2" />
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
