import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OrderListItem } from '@/types';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Eye, Trash } from 'lucide-react';

export const columns: ColumnDef<OrderListItem>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => <Badge variant="outline">{row.original.id}</Badge>,
    },
    {
        id: 'customer',
        header: 'Customer',
        accessorFn: (row) => row.customer?.name ?? '—',
        cell: ({ row }) => <span className="truncate">{row.original.customer?.name ?? '—'}</span>,
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <span className="capitalize">{row.original.status}</span>,
    },
    {
        accessorKey: 'total',
        header: 'Total',
        cell: ({ row }) => <div className="text-right font-semibold">${Number(row.original.total).toFixed(2)}</div>,
    },
    {
        accessorKey: 'created_at',
        header: 'Created',
        cell: ({ row }) => <div className="text-right">{new Date(row.original.created_at).toLocaleString()}</div>,
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
            <div className="flex items-center justify-end gap-2">
                <Button variant="ghost" size="icon" asChild>
                    <Link href={`/cashier/orders/${row.original.id}`}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Show</span>
                    </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                    <Link href={`/cashier/orders/${row.original.id}/edit`}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                    </Link>
                </Button>
                <Button
                    variant="ghost"
                    className="bg-transparent text-destructive shadow-none hover:bg-destructive/10 hover:text-destructive/90"
                    size="icon"
                    asChild
                >
                    <Link href={`/cashier/orders/${row.original.id}`} method="delete" preserveScroll as="button">
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                    </Link>
                </Button>
            </div>
        ),
    },
];

export default columns;
