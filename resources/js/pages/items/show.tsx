import Header from '@/components/header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Item } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeftIcon, PackageIcon, ShoppingCartIcon } from 'lucide-react';

export default function ShowItemPage({ item }: { item: Item }) {
    const { post } = useForm({
        itemId: item.id,
        quantity: 1,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('customer.orders.store'));
    };

    return (
        <>
            <Header />
            <div className="container mx-auto max-w-2xl px-4 py-8">
                <div className="mb-6">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={route('storefront.index')}>
                            <ArrowLeftIcon className="mr-2 size-4" />
                            Back to Storefront
                        </Link>
                    </Button>
                </div>
                <Card>
                    <CardHeader>
                        <div className="mx-auto mb-4 flex size-24 items-center justify-center rounded-lg bg-muted">
                            <PackageIcon className="size-12 text-muted-foreground" />
                        </div>
                        <CardTitle className="text-2xl font-bold">{item.name}</CardTitle>
                        <Badge variant="secondary" className="mx-auto w-fit">
                            ID: {item.id}
                        </Badge>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="mb-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase">Description</h3>
                            <p className="leading-relaxed text-foreground">{item.description}</p>
                        </div>

                        <div>
                            <h3 className="mb-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase">Price</h3>
                            <p className="text-3xl font-bold text-foreground">${item.price.toFixed(2)}</p>
                        </div>

                        <div className="pt-4">
                            <form onSubmit={submit} className="mt-4">
                                <Button className="w-full" size="lg">
                                    <ShoppingCartIcon className="mr-2 h-4 w-4" />
                                    Order Now
                                </Button>
                            </form>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
