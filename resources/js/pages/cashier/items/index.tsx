import { Item } from '@/types';
import { Link } from '@inertiajs/react';

export default function CashierItemsIndex({ items }: { items: Item[] }) {
    return (
        <div className="p-4">
            <h1 className="mb-4 text-2xl font-bold">Store Items</h1>
            <Link href="/cashier/items/create" className="mb-4 inline-block rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                Add New Item
            </Link>
            <table>
                <thead>
                    <tr>
                        <th className="px-4 py-2">ID</th>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Description</th>
                        <th className="px-4 py-2">Price</th>
                        <th className="px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.length > 0 ? (
                        items.map((item) => (
                            <tr key={item.id}>
                                <td className="border px-4 py-2">{item.id}</td>
                                <td className="border px-4 py-2">{item.name}</td>
                                <td className="border px-4 py-2">{item.description}</td>
                                <td className="border px-4 py-2">${item.price.toFixed(2)}</td>
                                <td className="space-x-2 border px-4 py-2">
                                    <Link href={`/cashier/items/${item.id}`} className="text-blue-500 hover:underline">
                                        Show
                                    </Link>
                                    <Link href={`/cashier/items/${item.id}/edit`} className="text-blue-500 hover:underline">
                                        Edit
                                    </Link>
                                    <Link href={`/cashier/items/${item.id}`} method="delete" preserveScroll className="text-red-500 hover:underline">
                                        Delete
                                    </Link>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="border px-4 py-2 text-center">
                                No items available.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
