import { Item } from "@/types";
import { useForm } from "@inertiajs/react";

export default function EditItemPage({ item }: { item: Item }) {
    const { data, setData, put } = useForm({
        name: item.name,
        description: item.description,
        price: item.price,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(`/cashier/items/${item.id}`, {
            showProgress: true,
        });
    }

    return (
        <div>
            <h1>Edit Item</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        className="rounded-md border"
                        type="text"
                        id="name"
                        name="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea
                        className="rounded-md border"
                        id="description"
                        name="description"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        rows={4}
                        cols={50}
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="price">Price:</label>
                    <input
                        className="rounded-md border"
                        type="number"
                        id="price"
                        name="price"
                        step="0.01"
                        value={data.price}
                        onChange={(e) => setData('price', parseFloat(e.target.value))}
                    />
                </div>
                <button className="rounded-md border bg-gray-100" type="submit">
                    Update Item
                </button>
            </form>
        </div>
    );
}
