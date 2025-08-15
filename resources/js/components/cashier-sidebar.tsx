import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { RiMore2Line } from '@remixicon/react';

import { useIsMobile } from '@/hooks/use-mobile';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { HomeIcon, LogOutIcon, PackageIcon, ShoppingCartIcon, TagIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
const items = [
    {
        title: 'Home',
        url: route('cashier.dashboard'),
        icon: HomeIcon,
    },
    {
        title: 'Items',
        url: route('cashier.items.index'),
        icon: TagIcon,
    },
    {
        title: 'Orders',
        url: route('cashier.orders.index'),
        icon: PackageIcon,
    },
];

export function CashierSidebar() {
    const isMobile = useIsMobile();
    const page = usePage<SharedData>();
    const cashier = page.props.auth?.cashier;
    return (
        <Sidebar>
            <SidebarHeader>
                <ShoppingCartIcon className="ms-2 size-6" />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <Avatar className="transition-[width,height] duration-200 ease-in-out in-data-[state=expanded]:size-6">
                                        <AvatarImage src={cashier?.avatar} alt={cashier?.name} />
                                        <AvatarFallback>{cashier?.name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="ms-1 grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-medium">{cashier?.name}</span>
                                    </div>
                                    <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-accent/50 in-[[data-slot=dropdown-menu-trigger]:hover]:bg-transparent">
                                        <RiMore2Line className="size-5 opacity-40" size={20} />
                                    </div>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                                side={isMobile ? 'bottom' : 'right'}
                                align="end"
                                sideOffset={4}
                            >
                                <DropdownMenuItem className="gap-3 px-1">
                                    <LogOutIcon size={20} className="text-muted-foreground/70" aria-hidden="true" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
