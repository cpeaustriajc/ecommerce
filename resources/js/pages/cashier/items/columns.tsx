import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Item } from '@/types';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Eye, Trash } from 'lucide-react';

export const columns: ColumnDef<Item>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => <Badge variant="outline">{row.original.id}</Badge>,
    },
    {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => <span className="hidden text-muted-foreground md:inline">{row.original.description}</span>,
    },
    {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }) => <div className="text-right font-semibold">${Number(row.original.price).toFixed(2)}</div>,
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
            <div className="flex items-center justify-end gap-2">
                <Button variant="ghost" size="icon" asChild>
                    <Link href={`/cashier/items/${row.original.id}`}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Show</span>
                    </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                    <Link href={`/cashier/items/${row.original.id}/edit`}>
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
                    <Link href={`/cashier/items/${row.original.id}`} method="delete" preserveScroll as="button">
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                    </Link>
                </Button>
            </div>
        ),
    },
];
