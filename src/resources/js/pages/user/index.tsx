import React, { useState, useTransition } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app/AppLayout';
import {
    Search,
    Users,
    Shield,
    User as UserIcon,
    Plus,
    Edit2,
    Trash2,
    X,
    Check,
    Lock,
    Mail,
    AlertCircle,
    UserCheck,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

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
    available_roles: string[];
}

export default function UserIndex({ users, filters, available_roles = [] }: UserIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [, startTransition] = useTransition();

    const [modalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserData | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        password: '',
        roles: [] as string[],
    });

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

    const openCreateModal = () => {
        setEditingUser(null);
        reset();
        clearErrors();
        setData({
            name: '',
            email: '',
            password: '',
            roles: available_roles.length > 0 ? [available_roles[0]] : [],
        });
        setModalOpen(true);
    };

    const openEditModal = (user: UserData) => {
        setEditingUser(user);
        clearErrors();
        setData({
            name: user.name,
            email: user.email,
            password: '',
            roles: [...user.roles],
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingUser(null);
        reset();
        clearErrors();
    };

    const toggleRole = (roleName: string) => {
        if (data.roles.includes(roleName)) {
            setData('roles', data.roles.filter((r) => r !== roleName));
        } else {
            setData('roles', [...data.roles, roleName]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingUser) {
            put(`/users/${editingUser.id}`, {
                onSuccess: () => closeModal(),
            });
        } else {
            post('/users', {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (user: UserData) => {
        if (confirm(`Are you sure you want to delete user "${user.name}" (${user.email})? This action is irreversible.`)) {
            router.delete(`/users/${user.id}`);
        }
    };

    return (
        <AppLayout title="Staff Directory">
            <Head title="Staff Directory — Slotwise" />

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800/80 pb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">Staff & Users</h1>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                                Directory of registered system accounts, staff profiles, and security roles
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="text-xs font-mono text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-lg">
                            Total Accounts: <span className="text-zinc-900 dark:text-zinc-200 font-semibold">{users.total}</span>
                        </div>
                        <Button
                            onClick={openCreateModal}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium gap-1.5 shadow-xs"
                        >
                            <Plus className="w-4 h-4" />
                            Add User
                        </Button>
                    </div>
                </div>

                {/* Filter Toolbar */}
                <div className="flex items-center justify-between gap-4">
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

                {/* Data Grid Table */}
                <div className="border border-zinc-200 dark:border-zinc-800/80 rounded-xl overflow-hidden bg-white dark:bg-zinc-900/40 shadow-xs">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-zinc-50 dark:bg-zinc-900/70 border-b border-zinc-200 dark:border-zinc-800 text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-medium">
                            <tr>
                                <th className="px-5 py-3">User</th>
                                <th className="px-5 py-3">Assigned Roles</th>
                                <th className="px-5 py-3">Member Since</th>
                                <th className="px-5 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60 font-sans">
                            {users.data.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-5 py-12 text-center text-zinc-500 dark:text-zinc-400 text-sm">
                                        <div className="max-w-xs mx-auto space-y-2">
                                            <Users className="w-8 h-8 text-zinc-400 mx-auto stroke-[1.5]" />
                                            <p className="font-medium text-zinc-800 dark:text-zinc-200 text-xs">No users found</p>
                                            <p className="text-[11px] text-zinc-500">Try adjusting your filter search or create a new user account.</p>
                                        </div>
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
                                        <td className="px-5 py-3.5 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => openEditModal(user)}
                                                    className="h-8 w-8 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                                                    title="Edit account"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(user)}
                                                    className="h-8 w-8 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400"
                                                    title="Delete account"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* User Upsert Modal Dialog */}
                {modalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-200">
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6">
                            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                        <UserCheck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
                                            {editingUser ? 'Edit User Account' : 'Create User Account'}
                                        </h2>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                            {editingUser ? 'Update user credentials and permission roles' : 'Add a new team member or system administrator'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="name" className="text-xs font-medium">Full Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Alex Johnson"
                                        className="text-xs h-9"
                                        required
                                    />
                                    {errors.name && <p className="text-[11px] text-rose-500">{errors.name}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="email" className="text-xs font-medium">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="alex@example.com"
                                            className="text-xs h-9 pl-9"
                                            required
                                        />
                                    </div>
                                    {errors.email && <p className="text-[11px] text-rose-500">{errors.email}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="password" className="text-xs font-medium">
                                        {editingUser ? 'Password (Optional)' : 'Password'}
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                                        <Input
                                            id="password"
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder={editingUser ? 'Leave blank to preserve current password' : 'At least 8 characters'}
                                            className="text-xs h-9 pl-9"
                                            required={!editingUser}
                                        />
                                    </div>
                                    {errors.password && <p className="text-[11px] text-rose-500">{errors.password}</p>}
                                </div>

                                <div className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                                    <Label className="text-xs font-medium">Assigned Roles</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {available_roles.map((role) => {
                                            const isSelected = data.roles.includes(role);
                                            return (
                                                <button
                                                    key={role}
                                                    type="button"
                                                    onClick={() => toggleRole(role)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all border ${
                                                        isSelected
                                                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30'
                                                            : 'bg-zinc-100 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700/60 hover:border-zinc-300 dark:hover:border-zinc-600'
                                                    }`}
                                                >
                                                    {isSelected ? (
                                                        <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                                    ) : (
                                                        <Shield className="w-3.5 h-3.5 text-zinc-400" />
                                                    )}
                                                    <span className="capitalize">{role}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {errors.roles && <p className="text-[11px] text-rose-500">{errors.roles}</p>}
                                </div>

                                <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={closeModal}
                                        className="text-xs h-9"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-9 shadow-xs"
                                    >
                                        {processing ? 'Saving...' : editingUser ? 'Update User' : 'Create User'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}