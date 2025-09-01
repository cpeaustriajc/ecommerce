import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PaginationFromLaravel } from '@/components/ui/pagination';
import { TableHead, TableRow } from '@/components/ui/table';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Item } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowUpDown, Package, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { columns } from './columns';
import DataTable from './data-table';

type LaravelLink = { url: string | null; label: string; active: boolean };

export default function CashierItemsIndex({
    items,
    links,
    filters,
}: {
    items: Item[];
    links?: LaravelLink[];
    filters?: { q?: string; sort?: string; direction?: string };
}) {
    const page = usePage();
    const currentUrl = page.url || window.location.pathname;
    const [searchTerm, setSearchTerm] = useState(filters?.q ?? '');
    const currentSort = filters?.sort ?? null;
    const currentDirection = filters?.direction ?? null;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(currentUrl, { q: searchTerm }, { preserveState: true, replace: true });
    };

    const handleNavigate = (url?: string | null) => {
        if (!url) return;
        router.visit(url, { preserveState: true, preserveScroll: true });
    };

    const handleSort = (columnId: string) => {
        let direction = 'asc';
        if (currentSort === columnId && currentDirection === 'asc') direction = 'desc';

        const params = { q: searchTerm, sort: columnId, direction };
        router.get(currentUrl, params, { preserveState: true, replace: true });
    };

    return (
        <DashboardLayout>
            <Head title="Items — Cashier" />
            <div className="container mx-auto px-4 py-6">
                <div className="space-y-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Store Items</h1>
                            <p className="text-muted-foreground">Manage your product inventory</p>
                        </div>

                        <Button asChild>
                            <Link href="/cashier/items/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Add New Item
                            </Link>
                        </Button>
                    </div>

                    <form onSubmit={handleSearch} className="flex max-w-sm items-center space-x-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search items..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <Button type="submit">Search</Button>
                    </form>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Items ({items.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DataTable<Item, unknown>
                                columns={columns}
                                data={items}
                                header={
                                    <TableRow>
                                        <TableHead className="w-16">ID</TableHead>
                                        <TableHead>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="inline-flex items-center gap-2"
                                                onClick={() => handleSort('name')}
                                            >
                                                Name
                                                <ArrowUpDown className="h-4 w-4" />
                                            </Button>
                                        </TableHead>
                                        <TableHead className="hidden md:table-cell">Description</TableHead>
                                        <TableHead className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="inline-flex items-center gap-2"
                                                onClick={() => handleSort('price')}
                                            >
                                                Price
                                                <ArrowUpDown className="h-4 w-4" />
                                            </Button>
                                        </TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                }
                            />

                            {/* Pagination controls */}
                            <div className="mt-4 flex items-center justify-center">
                                <PaginationFromLaravel links={links ?? []} onNavigate={handleNavigate} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
