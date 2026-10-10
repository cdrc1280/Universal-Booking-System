import { Head, router } from '@inertiajs/react';
import { Search, Users, Shield, User as UserIcon } from 'lucide-react';
import { useState, useTransition } from 'react';

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
        <>
            <Head title="User Management" />
            <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800 pb-5">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-zinc-100">Users</h1>
                            <p className="text-xs text-zinc-400">Directory of registered system accounts and assigned roles</p>
                        </div>
                    </div>
                    <div className="text-xs font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-md">
                        Total Users: <span className="text-zinc-200 font-semibold">{users.total}</span>
                    </div>
                </div>

                {/* Filter Toolbar */}
                <div className="flex items-center gap-3">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Filter by name or email..."
                            className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        />
                    </div>
                </div>

                {/* Data Grid */}
                <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/30">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-zinc-900/70 border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-400 font-medium">
                            <tr>
                                <th className="px-5 py-3">User</th>
                                <th className="px-5 py-3">Roles</th>
                                <th className="px-5 py-3">Created</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/60 font-sans">
                            {users.data.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-5 py-8 text-center text-zinc-500 text-sm">
                                        No users found matching query.
                                    </td>
                                </tr>
                            ) : (
                                users.data.map((user) => (
                                    <tr key={user.id} className="hover:bg-zinc-900/40 transition-colors">
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 text-xs font-semibold">
                                                    <UserIcon className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-zinc-200">{user.name}</div>
                                                    <div className="text-xs text-zinc-400">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex flex-wrap gap-1.5">
                                                {user.roles.length === 0 ? (
                                                    <span className="text-xs text-zinc-500 italic">No roles</span>
                                                ) : (
                                                    user.roles.map((role) => (
                                                        <span
                                                            key={role}
                                                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                                        >
                                                            <Shield className="w-3 h-3" />
                                                            {role}
                                                        </span>
                                                    ))
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 text-xs text-zinc-400 font-mono">
                                            {user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}