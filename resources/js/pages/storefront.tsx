import SiteLayout from '@/layouts/site-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PaginationFromLaravel } from '@/components/ui/pagination';
import { Item } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useEchoPublic } from '@laravel/echo-react';
import { PackageIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StorefrontProps {
    items: Item[];
    links?: { url: string | null; label: string; active: boolean }[];
    meta?: { current_page?: number; last_page?: number; per_page?: number; total?: number };
}

export default function StoreFront({ items, links }: StorefrontProps) {
    const [localItems, setLocalItems] = useState<Item[]>(items);

    useEchoPublic<{ item: { id: number; name: string; price: number } }>('items', '.ItemPriceUpdated', (e) => {
        setLocalItems((prev) => prev.map((it) => (it.id === e.item.id ? { ...it, price: e.item.price } : it)));
    });

    useEffect(() => {
        setLocalItems(items);
    }, [items]);

    return (
        <>
            <Head title="Storefront" />
            <div className="container mx-auto px-4 py-1">
                <div className="container mx-auto px-4 py-2">
                    <div className="mb-1 text-center">
                        <h1 className="mb-2 text-xl font-bold text-foreground md:text-2xl">Latest Products</h1>
                        <p className="mx-auto max-w-2xl text-muted-foreground md:text-xs">
                            Discover our curated collection of premium apparel designed for comfort, style, and everyday elegance.
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                    {localItems.length > 0 ? (
                        localItems.map((item) => (
                            <Card key={item.id} className="transition-shadow hover:shadow-lg">
                                <CardHeader>
                                    <div className="mb-3 flex h-32 items-center justify-center rounded-md bg-muted">
                                        <PackageIcon className="h-12 w-12 text-muted-foreground" />
                                    </div>
                                    <CardTitle>{item.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-10">
                                        <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <div className="flex w-full items-center justify-between">
                                        <p className="text-xl font-bold">${item.price.toFixed(2)}</p>
                                        <Button asChild>
                                            <Link href={`/items/${item.id}`}>View Details</Link>
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))
                    ) : (
                        <p>No items available in the store.</p>
                    )}
                </div>

        <div className="mt-6 flex items-center justify-center">
                    <PaginationFromLaravel
                        links={links ?? []}
                        onNavigate={(url) => {
                            if (!url) return;
                            router.visit(url, { preserveState: true, preserveScroll: true });
                        }}
                    />
                </div>
            </div>
    </>
    );
}

// Persistent layout
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(StoreFront as any).layout = (page: React.ReactNode) => <SiteLayout>{page}</SiteLayout>;
