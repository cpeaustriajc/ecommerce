import { PageProps } from '@inertiajs/core';
import { Head, Link, usePage } from '@inertiajs/react';

interface SharedData extends PageProps {
    auth: {
        customer: {
            name: string;
        } | null;
    };
}

export default function StoreFront() {
    const page = usePage<SharedData>();

    return (
        <>
            <Head title="Storefront" />
            <nav className="flex gap-2">
                {page.props.auth.customer ? (
                    <>
                        <Link href="/customer/dashboard">Dashboard</Link>
                        <Link href={route('customer.logout')} method="post">
                            Logout
                        </Link>
                        <span>Welcome, {page.props.auth.customer.name}</span>
                    </>
                ) : (
                    <>
                        <Link href="/customer/register">Register</Link>
                        <Link href="/customer/login">Login</Link>
                    </>
                )}
            </nav>
        </>
    );
}
