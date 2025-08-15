import { CashierSidebar } from '@/components/cashier-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import * as React from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <CashierSidebar />
            <main className="flex h-screen w-full flex-col">
                <header className="flex w-full items-center justify-between border-b bg-sidebar p-4">
                    <SidebarTrigger />
                </header>
                {children}
            </main>
        </SidebarProvider>
    );
}
