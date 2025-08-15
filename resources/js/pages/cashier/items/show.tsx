import { Item } from "@/types";
import { Link } from "@inertiajs/react";

export default function ShowItemPage({ item }: { item: Item }) {
    return (
        <div className="p-4">
            <h1 className="mb-4 text-2xl font-bold">Item Details</h1>
            <div className="mb-4">
                <strong>ID:</strong> {item.id}
            </div>
            <div className="mb-4">
                <strong>Name:</strong> {item.name}
            </div>
            <div className="mb-4">
                <strong>Description:</strong> {item.description}
            </div>
            <div className="mb-4">
                <strong>Price:</strong> ${item.price.toFixed(2)}
            </div>
            <Link href={`/cashier/items/${item.id}/edit`} className="inline-block rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                Edit Item
            </Link>
        </div>
    );
}
