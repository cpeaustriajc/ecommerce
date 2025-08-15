import { Item, SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

interface StorefrontProps {
    items: Item[];
}

export default function StoreFront({ items }: StorefrontProps) {
    const page = usePage<SharedData>();

    return (
        <>
            <Head title="Storefront" />
            <nav className="flex gap-2">
                {page.props.auth.customer ? (
                    <>
                        <Link href={route('customer.profile', page.props.auth.customer.id)}>Profile</Link>
                        <Link href={route('customer.orders.index')}>Orders</Link>
                        <Link href={route('customer.logout')} method="post">
                            Logout
                        </Link>
                    </>
                ) : (
                    <>
                        <Link href="/customer/register">Register</Link>
                        <Link href="/customer/login">Login</Link>
                    </>
                )}
            </nav>
            <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
                {items.length > 0 ? (
                    items.map((item) => (
                        <div key={item.id} className="mb-4 rounded border p-4">
                            <h2 className="text-xl font-bold">{item.name}</h2>
                            <p>{item.description}</p>
                            <p className="text-lg font-semibold">${item.price.toFixed(2)}</p>
                            <Link href={`/items/${item.id}`} className="text-blue-500 hover:underline">
                                View Details
                            </Link>
                        </div>
                    ))
                ) : (
                    <p>No items available in the store.</p>
                )}
            </div>
        </>
    );
}
