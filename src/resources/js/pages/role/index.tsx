import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app/AppLayout';
import {
    Shield,
    Key,
    Plus,
    Edit2,
    Trash2,
    Check,
    Users,
    Lock,
    ShieldCheck,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from '@/components/ui/sheet';

interface PermissionItem {
    id: number;
    name: string;
    guard_name: string;
}

interface RoleItem {
    id: number;
    name: string;
    guard_name: string;
    users_count: number;
    permissions?: PermissionItem[];
}

interface Props {
    roles: RoleItem[];
    permissions: PermissionItem[];
}

export default function RoleIndex({ roles, permissions = [] }: Props) {
    const [sheetOpen, setSheetOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<RoleItem | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        permissions: [] as string[],
    });

    const openCreate = () => {
        setEditingRole(null);
        reset();
        clearErrors();
        setData({
            name: '',
            permissions: [],
        });
        setSheetOpen(true);
    };

    const openEdit = (role: RoleItem) => {
        setEditingRole(role);
        clearErrors();
        setData({
            name: role.name,
            permissions: role.permissions?.map((p) => p.name) ?? [],
        });
        setSheetOpen(true);
    };

    const closeSheet = () => {
        setSheetOpen(false);
        setEditingRole(null);
        reset();
        clearErrors();
    };

    const togglePermission = (permName: string) => {
        if (data.permissions.includes(permName)) {
            setData('permissions', data.permissions.filter((p) => p !== permName));
        } else {
            setData('permissions', [...data.permissions, permName]);
        }
    };

    const toggleSelectAllPermissions = () => {
        if (data.permissions.length === permissions.length) {
            setData('permissions', []);
        } else {
            setData('permissions', permissions.map((p) => p.name));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingRole) {
            put(`/roles/${editingRole.id}`, {
                onSuccess: () => closeSheet(),
            });
        } else {
            post('/roles', {
                onSuccess: () => closeSheet(),
            });
        }
    };

    const handleDelete = (role: RoleItem) => {
        if (role.name.toLowerCase() === 'admin') {
            alert('The primary administrator role is protected by system policy and cannot be deleted.');
            return;
        }

        if (role.users_count > 0) {
            alert(`Cannot delete role "${role.name}" because it is currently assigned to ${role.users_count} user(s). Reassign them first.`);
            return;
        }

        if (confirm(`Are you sure you want to delete the security role "${role.name}"?`)) {
            router.delete(`/roles/${role.id}`);
        }
    };

    return (
        <AppLayout title="Access Control">
            <Head title="Access Control" />

            <div className="space-y-8 max-w-7xl mx-auto">
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800/80 pb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
                                Access Control & Roles
                            </h1>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                                Granular permissions, security authorization levels, and role-based access boundaries
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="text-xs font-mono text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-lg">
                            Defined Roles: <span className="text-zinc-900 dark:text-zinc-200 font-semibold">{roles.length}</span>
                        </div>
                        <Button
                            onClick={openCreate}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium gap-1.5 shadow-xs"
                        >
                            <Plus className="w-4 h-4" />
                            Create Role
                        </Button>
                    </div>
                </div>

                {/* Role Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {roles.map((role) => {
                        const isProtected = role.name.toLowerCase() === 'admin';
                        return (
                            <Card
                                key={role.id}
                                className="border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700/80 transition-all flex flex-col justify-between"
                            >
                                <CardContent className="p-5 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60 flex items-center justify-center text-zinc-600 dark:text-zinc-400">
                                                <Key className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h2 className="font-semibold text-zinc-900 dark:text-white capitalize text-sm">
                                                    {role.name}
                                                </h2>
                                                <span className="text-[11px] text-zinc-500 flex items-center gap-1 font-mono">
                                                    <Users className="w-3 h-3" />
                                                    {role.users_count} {role.users_count === 1 ? 'user' : 'users'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            {isProtected ? (
                                                <Badge variant="outline" className="text-[10px] text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800/40 gap-1">
                                                    <Lock className="w-2.5 h-2.5" />
                                                    System
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
                                                    {role.guard_name}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
                                        <h3 className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                            Granted Permissions ({role.permissions?.length ?? 0})
                                        </h3>
                                        <div className="flex flex-wrap gap-1.5 min-h-[3rem]">
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
                                                <span className="text-xs text-zinc-400 italic">No permissions assigned</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-end gap-1.5">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => openEdit(role)}
                                            className="h-8 px-2.5 text-xs text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white gap-1"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" />
                                            Edit
                                        </Button>

                                        {!isProtected && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(role)}
                                                className="h-8 px-2.5 text-xs text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 gap-1"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                                Delete
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* shadcn Sheet Slide-Over Form */}
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                    <SheetContent side="right" className="sm:max-w-lg flex flex-col justify-between">
                        <div>
                            <SheetHeader>
                                <div className="flex items-center gap-2.5">
                                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <SheetTitle>
                                            {editingRole ? 'Edit Security Role' : 'Create New Role'}
                                        </SheetTitle>
                                        <SheetDescription>
                                            {editingRole
                                                ? 'Modify role configuration and assigned permission limits'
                                                : 'Define a custom authorization role with granular capabilities'}
                                        </SheetDescription>
                                    </div>
                                </div>
                            </SheetHeader>

                            <form id="role-form" onSubmit={handleSubmit} className="space-y-5 py-6">
                                <div className="space-y-1.5">
                                    <Label htmlFor="role-name" className="text-xs font-medium">Role Identifier Name</Label>
                                    <Input
                                        id="role-name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g. manager, receptionist, specialist"
                                        className="text-xs h-9"
                                        required
                                    />
                                    {errors.name && <p className="text-[11px] text-rose-500">{errors.name}</p>}
                                </div>

                                <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-medium">Assignable Permissions</Label>
                                        {permissions.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={toggleSelectAllPermissions}
                                                className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                                            >
                                                {data.permissions.length === permissions.length ? 'Deselect All' : 'Select All'}
                                            </button>
                                        )}
                                    </div>

                                    {permissions.length === 0 ? (
                                        <p className="text-xs text-zinc-500 italic py-2">
                                            No system permissions defined in the database.
                                        </p>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-1.5 border border-zinc-100 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-950/30">
                                            {permissions.map((perm) => {
                                                const isSelected = data.permissions.includes(perm.name);
                                                return (
                                                    <button
                                                        key={perm.id}
                                                        type="button"
                                                        onClick={() => togglePermission(perm.name)}
                                                        className={`p-2 rounded-lg text-xs font-medium text-left flex items-center gap-2 transition-all border ${
                                                            isSelected
                                                                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                                                                : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                                                        }`}
                                                    >
                                                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                                                            isSelected
                                                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                                                : 'border-zinc-300 dark:border-zinc-700'
                                                        }`}>
                                                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                                        </div>
                                                        <span className="truncate">{perm.name}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                    {errors.permissions && <p className="text-[11px] text-rose-500">{errors.permissions}</p>}
                                </div>
                            </form>
                        </div>

                        <SheetFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={closeSheet}
                                className="text-xs h-9"
                            >
                                Cancel
                            </Button>
                            <Button
                                form="role-form"
                                type="submit"
                                disabled={processing}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-9 shadow-xs"
                            >
                                {processing ? 'Saving...' : editingRole ? 'Update Role' : 'Create Role'}
                            </Button>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>
        </AppLayout>
    );
}