import React from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Settings, LogOut, Shield } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserAvatar } from '@/components/custom/UserAvatar';
import { Badge } from '@/components/ui/badge';

export function UserMenuDropdown() {
    const { props } = usePage();
    const authProps = props as Record<string, unknown>;
    const user = (authProps.auth as { user?: { id?: number; name?: string; email?: string; roles?: string[] } } | undefined)?.user;

    const handleLogout = () => {
        router.post('/logout');
    };

    const primaryRole = user?.roles?.[0] ?? 'Staff';

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="flex items-center gap-2 rounded-lg outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500/50 cursor-pointer"
                    aria-label="User navigation menu"
                >
                    <UserAvatar name={user?.name ?? 'Admin User'} size="md" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 p-1.5 shadow-lg">
                <DropdownMenuLabel className="p-2 font-normal">
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-semibold leading-none text-zinc-900 dark:text-zinc-100 truncate">
                                {user?.name ?? 'Administrator'}
                            </p>
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-zinc-200 dark:border-zinc-700/60 font-mono">
                                {primaryRole}
                            </Badge>
                        </div>
                        <p className="text-[11px] leading-none text-zinc-500 dark:text-zinc-400 truncate">
                            {user?.email ?? 'admin@example.com'}
                        </p>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <Link
                        href="/settings"
                        className="flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
                    >
                        <Settings className="w-3.5 h-3.5 text-zinc-500" />
                        <span>Account Settings</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-rose-600 dark:text-rose-400 focus:bg-rose-50 dark:focus:bg-rose-950/40 focus:text-rose-700 dark:focus:text-rose-300 cursor-pointer"
                >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
