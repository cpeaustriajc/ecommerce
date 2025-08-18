import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';
import { BellIcon, CircleUserRoundIcon, DotIcon, ShoppingCartIcon } from 'lucide-react';
import { useMemo } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Separator } from './ui/separator';
import { useNotifications, ItemNotification as CtxNotification } from '@/lib/notifications-context';

type ItemNotification = CtxNotification;

function CustomerNotifications({ customerId }: { customerId: number }) {
    const { notifications, unreadCount, add, markAllRead, markRead } = useNotifications();

    const channelName = useMemo(() => `customer.${customerId}`, [customerId]);

    // Use leading dot for custom broadcastAs names per Laravel Echo docs
    useEcho<ItemNotification>(channelName, '.ItemNotification', (e) => {
        add({
            id: Date.now(),
            item: e.item,
            message: e.message,
            created_at: new Date().toISOString(),
            hasUnread: true,
        });
    });

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Notifications" className="relative">
                    <BellIcon size={16} aria-hidden="true" />
                    <Badge className="absolute -top-2 left-full min-w-5 -translate-x-1/2 px-1">{unreadCount > 99 ? '99+' : unreadCount}</Badge>
                </Button>
            </PopoverTrigger>
        <PopoverContent align="end">
                <div className="flex w-64 items-baseline justify-between gap-2">
                    <h3 className="text-sm font-semibold">Notifications</h3>
            <Button variant="ghost" size="sm" onClick={markAllRead}>
                        Mark all as read
                    </Button>
                </div>
                <Separator />
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className="rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
                onClick={() => markRead(notification.id)}
                        >
                            <div className="relative flex items-start pe-3">
                                <div className="flex-1 space-y-1">
                                    <Link
                                        className="text-left text-foreground/80 after:absolute after:inset-0"
                                        href={`/items/${notification.item.id}`}
                    onClick={() => markRead(notification.id)}
                                    >
                                        <span className="font-medium hover:underline">{notification.message}</span>
                                    </Link>
                                    <div className="text-xs text-muted-foreground">{notification.created_at}</div>
                                </div>
                                {notification.hasUnread && (
                                    <div className="absolute end-0 self-center">
                                        <span className="sr-only">Unread</span>
                                        <DotIcon />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-4 text-sm text-muted-foreground">No notifications</div>
                )}
            </PopoverContent>
        </Popover>
    );
}

export default function Header() {
    const page = usePage<SharedData>();

    return (
        <header className="border-b px-4 md:px-6">
            <nav className="flex h-16 items-center justify-between gap-4">
                <Link href="/">
                    <ShoppingCartIcon size={32} />
                </Link>
                <div className="flex items-center gap-4">
                    {page.props.auth.customer ? (
                        <CustomerNotifications customerId={page.props.auth.customer.id} />
                    ) : (
                        <Button variant="outline" size="icon" aria-label="Notifications" className="relative" disabled>
                            <BellIcon size={16} aria-hidden="true" />
                            <Badge className="absolute -top-2 left-full min-w-5 -translate-x-1/2 px-1">0</Badge>
                        </Button>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" aria-label="User Menu">
                                <CircleUserRoundIcon size={16} aria-hidden="true" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64">
                            <DropdownMenuLabel className="flex items-start gap-3">
                                <CircleUserRoundIcon size={32} className="shrink-0" />
                                <div className="flex min-w-0 flex-col">
                                    <span className="truncate text-sm font-medium text-foreground">{page.props.auth.customer?.name ?? 'Guest'}</span>
                                    <span className="truncate text-xs font-normal text-muted-foreground">
                                        {page.props.auth.customer?.email ?? 'guest@email.com'}
                                    </span>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                {page.props.auth.customer ? (
                                    <>
                                        <DropdownMenuItem asChild>
                                            <Link href={route('customer.profile.show', page.props.auth.customer.id)}>Profile</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href={route('customer.orders.index')}>Orders</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <Link href={route('customer.logout')} method="post">
                                                Logout
                                            </Link>
                                        </DropdownMenuItem>
                                    </>
                                ) : (
                                    <>
                                        <DropdownMenuItem asChild>
                                            <Link href="/customer/register">Register</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/customer/login">Login</Link>
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </nav>
        </header>
    );
}
