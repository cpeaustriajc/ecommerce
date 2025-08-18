import SiteLayout from '@/layouts/site-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Item } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEchoPublic } from '@laravel/echo-react';
import { ArrowLeftIcon, PackageIcon, ShoppingCartIcon } from 'lucide-react';
import { useState } from 'react';

export default function ShowItemPage({ item, isSubscribed }: { item: Item; isSubscribed: boolean }) {
    const [currentPrice, setCurrentPrice] = useState<number>(item.price);

    useEchoPublic<{ item: { id: number; price: number } }>(`items.${item.id}`, '.ItemPriceUpdated', (e) => {
        if (e.item.id === item.id) {
            setCurrentPrice(e.item.price);
        }
    });
    const { post, delete: destroy } = useForm({
        itemId: item.id,
        quantity: 1,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('customer.orders.store'));
    };

    return (
        <>
            <Head title={item.name ? `${item.name} — Item` : 'Item Details'} />
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
                            <p className="text-3xl font-bold text-foreground">${currentPrice.toFixed(2)}</p>
                        </div>

                        <div className="pt-4">
                            <form onSubmit={submit} className="mt-4 space-y-2">
                                <Button
                                    type="button"
                                    onClick={() => {
                                        if (isSubscribed) {
                                            destroy(route('items.unsubscribe', item.id));
                                        } else {
                                            post(route('items.subscribe', item.id));
                                        }
                                    }}
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                >
                                    {isSubscribed ? 'Unsubscribe from Updates' : 'Subscribe for Updates'}
                                </Button>
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(ShowItemPage as any).layout = (page: React.ReactNode) => <SiteLayout>{page}</SiteLayout>;
