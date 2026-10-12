import React, { useState, useTransition } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app/AppLayout';
import { Search, Users, Shield, User as UserIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface UserData {
    id: number;
    name: string;
    email: string;
    created_at: string | null;
    roles: string[];
}

interface UserIndexProps {
    users: {
        data: UserData[];
        current_page: number;
        last_page: number;
        total: number;
    };
    filters: {
        search?: string;
    };
}

export default function UserIndex({ users, filters }: UserIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [, startTransition] = useTransition();

    const handleSearch = (query: string) => {
        setSearch(query);
        startTransition(() => {
            router.get(
                '/users',
                { search: query || undefined },
                { preserveState: true, replace: true }
            );
        });
    };

    return (
        <AppLayout title="Staff Directory">
            <Head title="Staff Directory — Slotwise" />

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800/80 pb-5">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">Staff & Users</h1>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Directory of registered system accounts and security roles</p>
                        </div>
                    </div>
                    <div className="text-xs font-mono text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-lg">
                        Total Users: <span className="text-zinc-900 dark:text-zinc-200 font-semibold">{users.total}</span>
                    </div>
                </div>

                {/* Filter Toolbar */}
                <div className="flex items-center gap-3">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                        <Input
                            type="text"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Filter by name or email..."
                            className="pl-9 h-9 text-xs bg-white dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800"
                        />
                    </div>
                </div>

                {/* Data Grid */}
                <div className="border border-zinc-200 dark:border-zinc-800/80 rounded-xl overflow-hidden bg-white dark:bg-zinc-900/40 shadow-xs">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-zinc-50 dark:bg-zinc-900/70 border-b border-zinc-200 dark:border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-medium">
                            <tr>
                                <th className="px-5 py-3">User</th>
                                <th className="px-5 py-3">Assigned Roles</th>
                                <th className="px-5 py-3">Member Since</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60 font-sans">
                            {users.data.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-5 py-8 text-center text-zinc-500 text-sm">
                                        No users found matching query.
                                    </td>
                                </tr>
                            ) : (
                                users.data.map((user) => (
                                    <tr key={user.id} className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/30 transition-colors">
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60 flex items-center justify-center text-zinc-600 dark:text-zinc-400 text-xs font-semibold">
                                                    <UserIcon className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-zinc-900 dark:text-zinc-200 text-xs sm:text-sm">{user.name}</div>
                                                    <div className="text-xs text-zinc-500 dark:text-zinc-400">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex flex-wrap gap-1.5">
                                                {user.roles.length === 0 ? (
                                                    <span className="text-xs text-zinc-400 dark:text-zinc-500 italic">No roles</span>
                                                ) : (
                                                    user.roles.map((role) => (
                                                        <Badge
                                                            key={role}
                                                            variant="secondary"
                                                            className="text-[11px] gap-1 font-normal bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800/40"
                                                        >
                                                            <Shield className="w-3 h-3" />
                                                            {role}
                                                        </Badge>
                                                    ))
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                                            {user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}