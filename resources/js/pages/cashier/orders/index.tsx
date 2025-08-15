import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PaginationFromLaravel } from '@/components/ui/pagination';
import { TableHead, TableRow } from '@/components/ui/table';
import { columns } from './columns';
import DataTable from './data-table';
import { ArrowUpDown } from 'lucide-react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Link, router, usePage, Head } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';

type OrderStatus = 'pending' | 'completed' | 'cancelled';

type Pivot = { quantity: number; price: number };
type OrderItem = { id: number; name: string; pivot: Pivot };

type OrderListItem = {
    id: number;
    status: OrderStatus;
    total: number;
    created_at: string;
    items?: OrderItem[];
    customer?: { id: number; name: string } | null;
    cashier?: { id: number; name: string } | null;
};

type Pagination<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
};

export default function CashierOrdersIndex({ orders, filters }: { orders: Pagination<OrderListItem>; filters?: { q?: string; sort?: string; direction?: string } }) {
    const page = usePage();
    const currentUrl = page.url || window.location.pathname;
    const [searchTerm, setSearchTerm] = useState(filters?.q ?? '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(currentUrl, { q: searchTerm }, { preserveState: true, replace: true });
    };

    const handleNavigate = (url?: string | null) => {
        if (!url) return;
        router.visit(url);
    };

    return (
        <DashboardLayout>
            <Head title="Orders — Cashier" />
            <div className="container mx-auto px-4 py-6">
                <div className="space-y-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                            <p className="text-muted-foreground">Manage store orders</p>
                        </div>

                        <Button asChild>
                            <Link href="/cashier/orders/create">New Order</Link>
                        </Button>
                    </div>

                    <form onSubmit={handleSearch} className="flex max-w-sm items-center space-x-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search orders..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <Button type="submit">Search</Button>
                    </form>

                    <Card>
                        <CardHeader>
                            <CardTitle>Orders ({orders.data.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DataTable<OrderListItem, unknown>
                                columns={columns}
                                data={orders.data}
                                header={
                                    <TableRow>
                                        <TableHead className="w-16">ID</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="inline-flex items-center gap-2"
                                                onClick={() => {
                                                    // server-driven sort by total
                                                    const sort = 'total';
                                                    let direction = 'asc';
                                                    if (filters?.sort === sort && filters?.direction === 'asc') direction = 'desc';
                                                    router.get(currentUrl, { q: searchTerm, sort, direction }, { preserveState: true, replace: true });
                                                }}
                                            >
                                                Total
                                                <ArrowUpDown className="h-4 w-4" />
                                            </Button>
                                        </TableHead>
                                        <TableHead className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="inline-flex items-center gap-2"
                                                onClick={() => {
                                                    const sort = 'created_at';
                                                    let direction = 'asc';
                                                    if (filters?.sort === sort && filters?.direction === 'asc') direction = 'desc';
                                                    router.get(currentUrl, { q: searchTerm, sort, direction }, { preserveState: true, replace: true });
                                                }}
                                            >
                                                Created
                                                <ArrowUpDown className="h-4 w-4" />
                                            </Button>
                                        </TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                }
                            />

                            <div className="mt-4 flex items-center justify-center">
                                <PaginationFromLaravel links={orders.links} onNavigate={handleNavigate} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
