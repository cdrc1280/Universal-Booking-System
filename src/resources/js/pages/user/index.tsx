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
    Check,
    Lock,
    Mail,
    UserCheck,
    MoreVertical,
    Building2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { DataTablePagination } from '@/components/ui/pagination';

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
        per_page?: number;
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
                { search: query || undefined, page: 1, per_page: users.per_page || 20 },
                { preserveState: true, replace: true }
            );
        });
    };

    const handlePageChange = (page: number) => {
        router.get(
            '/users',
            { search: search || undefined, page, per_page: users.per_page || 20 },
            { preserveState: true, preserveScroll: true }
        );
    };

    const openCreate = () => {
        setEditingUser(null);
        reset();
        clearErrors();
        setData({
            name: '',
            email: '',
            password: '',
            roles: [],
        });
        setModalOpen(true);
    };

    const openEdit = (user: UserData) => {
        setEditingUser(user);
        clearErrors();
        setData({
            name: user.name,
            email: user.email,
            password: '',
            roles: user.roles,
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
        if (confirm(`Are you sure you want to delete user "${user.name}"? This action cannot be undone.`)) {
            router.delete(`/users/${user.id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout title="Staff & User Directory">
            <Head title="Staff Directory" />

            <div className="space-y-6 w-full">
                {/* Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#dadce0] dark:border-[#3c4043] pb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-[#202124] dark:text-[#ffffff]">
                                Staff & User Accounts
                            </h1>
                            <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6] mt-0.5">
                                Directory of registered staff, providers, coordinators, and administrative profiles
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="text-xs font-mono text-[#5f6368] dark:text-[#9aa0a6] bg-[#f1f3f4] dark:bg-[#303134] border border-[#dadce0] dark:border-[#3c4043] px-3 py-1.5 rounded-lg">
                            Total Accounts: <span className="text-[#202124] dark:text-[#ffffff] font-semibold">{users.total}</span>
                        </div>
                        <Button
                            onClick={openCreate}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium gap-1.5 shadow-xs"
                        >
                            <Plus className="w-4 h-4" />
                            Add Staff Member
                        </Button>
                    </div>
                </div>

                {/* Filter Toolbar */}
                <div className="flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#5f6368] dark:text-[#9aa0a6]" />
                        <Input
                            type="text"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Filter by name or email..."
                            className="pl-9 h-9 text-xs bg-white dark:bg-[#303134] border-[#dadce0] dark:border-[#3c4043] text-[#202124] dark:text-[#e8eaed]"
                        />
                    </div>
                </div>

                {/* Data Grid Table with Actions in First Column & Confined Scroll Container */}
                <div className="border border-[#dadce0] dark:border-[#3c4043] rounded-xl overflow-hidden bg-white dark:bg-[#303134] shadow-xs">
                    <div className="overflow-x-auto max-w-full">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#f8f9fa] dark:bg-[#202124] border-b border-[#dadce0] dark:border-[#3c4043] text-[11px] uppercase tracking-wider text-[#5f6368] dark:text-[#9aa0a6] font-medium">
                                <tr>
                                    {/* Actions always as first column */}
                                    <th className="px-4 py-3 w-16 text-center">Actions</th>
                                    <th className="px-5 py-3">Staff Member</th>
                                    <th className="px-5 py-3">Assigned Roles</th>
                                    <th className="px-5 py-3">Member Since</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#dadce0] dark:divide-[#3c4043] font-sans">
                                {users.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-5 py-12 text-center text-[#5f6368] dark:text-[#9aa0a6] text-sm">
                                            <div className="max-w-xs mx-auto space-y-2">
                                                <Users className="w-8 h-8 text-[#5f6368] dark:text-[#9aa0a6] mx-auto stroke-[1.5]" />
                                                <p className="font-medium text-[#202124] dark:text-[#e8eaed] text-xs">No users found</p>
                                                <p className="text-[11px] text-[#5f6368] dark:text-[#9aa0a6]">Try adjusting your filter search or create a new user account.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    users.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-[#f1f3f4] dark:hover:bg-[#3c4043]/40 transition-colors">
                                            {/* Column 1: Kebab Actions Dropdown */}
                                            <td className="px-4 py-3.5 text-center">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-[#5f6368] hover:text-[#202124] dark:text-[#9aa0a6] dark:hover:text-[#ffffff] rounded-lg"
                                                            title="Staff Actions"
                                                        >
                                                            <MoreVertical className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="start" className="w-44">
                                                        <DropdownMenuLabel className="text-[11px] font-semibold uppercase tracking-wider text-[#5f6368] dark:text-[#9aa0a6]">
                                                            Staff Actions
                                                        </DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => openEdit(user)}
                                                            className="gap-2 cursor-pointer text-xs"
                                                        >
                                                            <Edit2 className="w-3.5 h-3.5 text-[#5f6368] dark:text-[#9aa0a6]" />
                                                            <span>Edit Account</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleDelete(user)}
                                                            className="gap-2 cursor-pointer text-xs text-rose-600 dark:text-rose-400 focus:text-rose-600 dark:focus:text-rose-400"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                                                            <span>Delete Account</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>

                                            {/* Column 2: User Identity */}
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-[#f1f3f4] dark:bg-[#202124] border border-[#dadce0] dark:border-[#3c4043] flex items-center justify-center text-[#5f6368] dark:text-[#9aa0a6] text-xs font-semibold">
                                                        <UserIcon className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-[#202124] dark:text-[#ffffff] text-xs sm:text-sm">{user.name}</div>
                                                        <div className="text-xs text-[#5f6368] dark:text-[#9aa0a6]">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Column 3: Roles */}
                                            <td className="px-5 py-3.5">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {user.roles.length === 0 ? (
                                                        <span className="text-xs text-[#5f6368] dark:text-[#9aa0a6] italic">No roles</span>
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

                                            {/* Column 4: Creation Date */}
                                            <td className="px-5 py-3.5 text-xs text-[#5f6368] dark:text-[#9aa0a6] font-mono">
                                                {user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Standardized 20-per-page Pagination */}
                    <DataTablePagination
                        currentPage={users.current_page}
                        lastPage={users.last_page}
                        total={users.total}
                        perPage={users.per_page || 20}
                        onPageChange={handlePageChange}
                    />
                </div>

                {/* Pop-up Modal */}
                <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                                    <UserCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <DialogTitle>
                                        {editingUser ? 'Edit Staff Account' : 'Register New Staff Member'}
                                    </DialogTitle>
                                    <DialogDescription>
                                        {editingUser
                                            ? 'Update staff credentials and assigned role boundaries'
                                            : 'Add a new clinic staff member, service provider, or administrator'}
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <form id="user-form" onSubmit={handleSubmit} className="space-y-4 py-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="name" className="text-xs font-medium">Full Name *</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Dr. Alex Johnson / Maria Santos"
                                    className="text-xs h-9 bg-white dark:bg-[#202124] border-[#dadce0] dark:border-[#3c4043]"
                                    required
                                />
                                {errors.name && <p className="text-[11px] text-rose-500">{errors.name}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-xs font-medium">Work Email Address *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="staff@universalbooking.ph"
                                    className="text-xs h-9 bg-white dark:bg-[#202124] border-[#dadce0] dark:border-[#3c4043]"
                                    required
                                />
                                {errors.email && <p className="text-[11px] text-rose-500">{errors.email}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="password" className="text-xs font-medium">
                                    {editingUser ? 'Password (leave blank to retain current)' : 'Account Password *'}
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder={editingUser ? '••••••••••••' : 'Min 8 characters'}
                                    className="text-xs h-9 bg-white dark:bg-[#202124] border-[#dadce0] dark:border-[#3c4043]"
                                    required={!editingUser}
                                />
                                {errors.password && <p className="text-[11px] text-rose-500">{errors.password}</p>}
                            </div>

                            <div className="space-y-2 pt-2 border-t border-[#dadce0]/60 dark:border-[#3c4043]/60">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-medium">Assigned System Roles</Label>
                                    <span className="text-[11px] text-[#5f6368] dark:text-[#9aa0a6]">
                                        {data.roles.length} selected
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto p-1 border border-[#dadce0] dark:border-[#3c4043] rounded-lg bg-[#f8f9fa] dark:bg-[#202124]/50">
                                    {available_roles.length === 0 ? (
                                        <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6] p-2 col-span-2 italic text-center">
                                            No roles configured in system.
                                        </p>
                                    ) : (
                                        available_roles.map((role) => {
                                            const isChecked = data.roles.includes(role);
                                            return (
                                                <button
                                                    key={role}
                                                    type="button"
                                                    onClick={() => toggleRole(role)}
                                                    className={`flex items-center justify-between p-2 rounded text-xs transition-colors text-left ${
                                                        isChecked
                                                            ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/30'
                                                            : 'hover:bg-[#f1f3f4] dark:hover:bg-[#303134] text-[#202124] dark:text-[#ffffff]'
                                                    }`}
                                                >
                                                    <span className="capitalize font-medium truncate">{role}</span>
                                                    {isChecked && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />}
                                                </button>
                                            );
                                        })
                                    )}
                                </div>
                                {errors.roles && <p className="text-[11px] text-rose-500">{errors.roles}</p>}
                            </div>
                        </form>

                        <DialogFooter className="gap-2 sm:gap-0 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={closeModal}
                                className="text-xs h-9 border-[#dadce0] dark:border-[#3c4043]"
                            >
                                Cancel
                            </Button>
                            <Button
                                form="user-form"
                                type="submit"
                                disabled={processing}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-9 shadow-xs"
                            >
                                {processing ? 'Saving...' : editingUser ? 'Update Staff Member' : 'Register Staff Member'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}