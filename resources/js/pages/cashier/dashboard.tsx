import { Link } from '@inertiajs/react';

export default function CashierDashboardPage() {
    return (
        <div className="flex h-screen flex-col items-center justify-center">
            <h1 className="mb-4 text-2xl font-bold">Cashier Dashboard</h1>
            <p className="text-gray-600">Welcome to the Cashier Dashboard!</p>
            <Link href="/cashier/items">Items</Link>
            <Link href="/cashier/orders">Orders</Link>
            <Link method="post" href={route('cashier.logout')}>
                Logout
            </Link>
        </div>
    );
}
