import React from 'react';
import { Head } from '@inertiajs/react';
import { Shield, Key } from 'lucide-react';

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
        <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
            <Head title="Roles & Permissions" />

            <div className="max-w-6xl mx-auto space-y-8">
                <header className="flex items-center justify-between border-b border-zinc-800 pb-5">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
                            <Shield className="w-6 h-6 text-emerald-400" />
                            Access Control & Roles
                        </h1>
                        <p className="text-sm text-zinc-400 mt-1">
                            Manage security roles and assign granular permissions.
                        </p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {roles.map((role) => (
                        <div
                            key={role.id}
                            className="p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/50 backdrop-blur-sm space-y-4 hover:border-zinc-700 transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Key className="w-4 h-4 text-zinc-400" />
                                    <h2 className="font-medium text-white capitalize">{role.name}</h2>
                                </div>
                                <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/50">
                                    {role.guard_name}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                                    Granted Permissions
                                </h3>
                                <div className="flex flex-wrap gap-1.5">
                                    {role.permissions && role.permissions.length > 0 ? (
                                        role.permissions.map((perm) => (
                                            <span
                                                key={perm.id}
                                                className="text-xs px-2 py-0.5 rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-800/40"
                                            >
                                                {perm.name}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-xs text-zinc-600 italic">No explicit permissions</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}