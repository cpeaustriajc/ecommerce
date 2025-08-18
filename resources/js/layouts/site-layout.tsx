import Header from '@/components/header';
import { usePage } from '@inertiajs/react';
import * as React from 'react';
import { NotificationsProvider } from '@/lib/notifications-context';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    const page = usePage<{ auth?: { customer?: { id: number } | null } }>();
    const customerId = page.props?.auth?.customer?.id;
    const storageKey = customerId ? `notifications:${customerId}` : undefined;

    return (
        <NotificationsProvider storageKey={storageKey}>
            <Header />
            <main>{children}</main>
        </NotificationsProvider>
    );
}
