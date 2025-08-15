import { Item } from '@/types';
import { useForm } from '@inertiajs/react';

export default function ShowItemPage({ item }: { item: Item }) {
    const { post } = useForm({
        itemId: item.id,
        quantity: 1,
    });

    return (
        <div className="p-4">
            <h1 className="mb-4 text-2xl font-bold">{item.name}</h1>
            <p className="mb-2">{item.description}</p>
            <p className="text-lg font-semibold">${item.price.toFixed(2)}</p>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    post(route('customer.orders.store'));
                }}
            >
                <button type="submit" className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                    Order
                </button>
            </form>
        </div>
    );
}
