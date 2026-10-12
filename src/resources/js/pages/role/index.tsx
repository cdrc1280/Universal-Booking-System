import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app/AppLayout';
import { Shield, Key } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PermissionItem {
    id: number;
    name: string;
    guard_name: string;
}

interface RoleItem {
    id: number;
    name: string;
    guard_name: string;
    permissions?: PermissionItem[];
}

interface Props {
    roles: RoleItem[];
    permissions: PermissionItem[];
}

export default function RoleIndex({ roles, permissions }: Props) {
    return (
        <AppLayout title="Access Control">
            <Head title="Access Control — Slotwise" />

            <div className="space-y-8 max-w-7xl mx-auto">
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800/80 pb-5">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">Access Control & Roles</h1>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                                Granular permissions and authorization levels for staff and administrators
                            </p>
                        </div>
                    </div>
                    <div className="text-xs font-mono text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-lg">
                        Defined Roles: <span className="text-zinc-900 dark:text-zinc-200 font-semibold">{roles.length}</span>
                    </div>
                </div>

                {/* Role Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {roles.map((role) => (
                        <Card
                            key={role.id}
                            className="border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700/80 transition-colors"
                        >
                            <CardContent className="p-5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400">
                                            <Key className="w-3.5 h-3.5" />
                                        </div>
                                        <h2 className="font-semibold text-zinc-900 dark:text-white capitalize text-sm">{role.name}</h2>
                                    </div>
                                    <Badge variant="outline" className="text-[10px] font-mono px-2 py-0.5 text-zinc-500 dark:text-zinc-400">
                                        {role.guard_name}
                                    </Badge>
                                </div>

                                <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
                                    <h3 className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                        Granted Permissions
                                    </h3>
                                    <div className="flex flex-wrap gap-1.5">
                                        {role.permissions && role.permissions.length > 0 ? (
                                            role.permissions.map((perm) => (
                                                <Badge
                                                    key={perm.id}
                                                    variant="secondary"
                                                    className="text-[11px] font-normal bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40"
                                                >
                                                    {perm.name}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-xs text-zinc-400 italic">No explicit permissions</span>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}