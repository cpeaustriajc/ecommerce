import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { CircleUserRoundIcon, ShoppingCartIcon } from 'lucide-react';
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

export default function Header() {
    const page = usePage<SharedData>();
    return (
        <header className="border-b px-4 md:px-6">
            <nav className="flex h-16 items-center justify-between gap-4">
                <Link href="/">
                    <ShoppingCartIcon size={32} />
                </Link>
                <div className="flex items-center gap-2">
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
