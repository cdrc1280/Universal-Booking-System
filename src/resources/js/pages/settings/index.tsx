import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { UserAvatar } from '@/components/custom/UserAvatar';
import {
    User,
    KeyRound,
    Check,
    AlertCircle,
    ShieldCheck,
    Mail,
    Lock
} from 'lucide-react';

export default function SettingsIndex() {
    const { props } = usePage();
    const authProps = props as Record<string, unknown>;
    const user = (authProps.auth as { user?: { id?: number; name?: string; email?: string; roles?: string[] } } | undefined)?.user;

    const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

    // Profile Information Form
    const profileForm = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
    });

    // Password Update Form
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        profileForm.put('/user/profile-information', {
            preserveScroll: true,
        });
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        passwordForm.put('/user/password', {
            preserveScroll: true,
            onSuccess: () => {
                passwordForm.reset();
            },
        });
    };

    const primaryRole = user?.roles?.[0] ?? 'Administrator';

    return (
        <AppLayout title="Account Settings">
            <Head title="Account Settings" />

            <div className="w-full space-y-6">
                {/* Header Welcome Rail */}
                <div className="border-b border-[#dadce0] dark:border-[#3c4043] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-[#202124] dark:text-[#ffffff] flex items-center gap-2.5">
                            <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            Account Settings
                        </h1>
                        <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6] mt-1">
                            Manage your administrative profile credentials, authentication tokens, and security preferences.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="px-2.5 py-1 font-mono text-xs border-[#dadce0] dark:border-[#3c4043] bg-[#f8f9fa] dark:bg-[#303134] text-[#202124] dark:text-[#e8eaed]">
                            Role: {primaryRole}
                        </Badge>
                    </div>
                </div>

                {/* Sub-Navigation Tabs */}
                <div className="flex items-center gap-2 border-b border-[#dadce0] dark:border-[#3c4043] pb-2">
                    <button
                        type="button"
                        onClick={() => setActiveTab('profile')}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                            activeTab === 'profile'
                                ? 'bg-emerald-600 text-white dark:bg-emerald-600 dark:text-white shadow-xs'
                                : 'text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#202124] dark:hover:text-[#ffffff] hover:bg-[#f1f3f4] dark:hover:bg-[#303134]'
                        }`}
                    >
                        <User className="w-3.5 h-3.5" />
                        <span>Profile Information</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('password')}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                            activeTab === 'password'
                                ? 'bg-emerald-600 text-white dark:bg-emerald-600 dark:text-white shadow-xs'
                                : 'text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#202124] dark:hover:text-[#ffffff] hover:bg-[#f1f3f4] dark:hover:bg-[#303134]'
                        }`}
                    >
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Security & Password</span>
                    </button>
                </div>

                {/* Tab Content Panels */}
                {activeTab === 'profile' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Profile Details Form (2 cols) */}
                        <Card className="lg:col-span-2 border-[#dadce0] dark:border-[#3c4043] bg-white dark:bg-[#303134]">
                            <CardHeader className="border-b border-[#dadce0]/60 dark:border-[#3c4043]/60 pb-4">
                                <CardTitle className="text-base font-semibold text-[#202124] dark:text-[#ffffff]">
                                    Personal Details
                                </CardTitle>
                                <CardDescription className="text-xs text-[#5f6368] dark:text-[#9aa0a6]">
                                    Update your displayed administrator name and official notification email address.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <form onSubmit={handleProfileSubmit} className="space-y-5">
                                    {profileForm.recentlySuccessful && (
                                        <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                                            <Check className="w-4 h-4 shrink-0" />
                                            <span>Profile information successfully updated.</span>
                                        </div>
                                    )}

                                    <div className="space-y-1.5">
                                        <Label htmlFor="profile-name" className="text-xs font-medium text-[#202124] dark:text-[#e8eaed]">
                                            Full Name
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="profile-name"
                                                type="text"
                                                value={profileForm.data.name}
                                                onChange={(e) => profileForm.setData('name', e.target.value)}
                                                className="pl-9 text-xs"
                                                required
                                            />
                                            <User className="w-4 h-4 text-[#5f6368] dark:text-[#9aa0a6] absolute left-3 top-1/2 -translate-y-1/2" />
                                        </div>
                                        {profileForm.errors.name && (
                                            <p className="text-xs text-rose-500 flex items-center gap-1 mt-1">
                                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                                <span>{profileForm.errors.name}</span>
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="profile-email" className="text-xs font-medium text-[#202124] dark:text-[#e8eaed]">
                                            Email Address
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="profile-email"
                                                type="email"
                                                value={profileForm.data.email}
                                                onChange={(e) => profileForm.setData('email', e.target.value)}
                                                className="pl-9 text-xs font-mono"
                                                required
                                            />
                                            <Mail className="w-4 h-4 text-[#5f6368] dark:text-[#9aa0a6] absolute left-3 top-1/2 -translate-y-1/2" />
                                        </div>
                                        {profileForm.errors.email && (
                                            <p className="text-xs text-rose-500 flex items-center gap-1 mt-1">
                                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                                <span>{profileForm.errors.email}</span>
                                            </p>
                                        )}
                                    </div>

                                    <div className="pt-2 flex justify-end">
                                        <Button
                                            type="submit"
                                            disabled={profileForm.processing}
                                            className="text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-xs"
                                        >
                                            {profileForm.processing ? 'Saving Changes...' : 'Save Profile Changes'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Avatar Live Preview (1 col) */}
                        <div className="space-y-6">
                            <Card className="border-[#dadce0] dark:border-[#3c4043] bg-white dark:bg-[#303134]">
                                <CardHeader className="border-b border-[#dadce0]/60 dark:border-[#3c4043]/60 pb-3">
                                    <CardTitle className="text-xs font-semibold uppercase tracking-wider text-[#5f6368] dark:text-[#9aa0a6]">
                                        Avatar Preview
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 text-center space-y-4">
                                    <div className="flex justify-center">
                                        <UserAvatar name={profileForm.data.name} size="lg" className="w-16 h-16 text-xl rounded-2xl" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-semibold text-[#202124] dark:text-[#ffffff] truncate">
                                            {profileForm.data.name || 'Account Holder'}
                                        </h3>
                                        <p className="text-xs font-mono text-[#5f6368] dark:text-[#9aa0a6] truncate">
                                            {profileForm.data.email || 'user@example.com'}
                                        </p>
                                    </div>
                                    <p className="text-[11px] text-[#5f6368] dark:text-[#9aa0a6]">
                                        Your avatar generates initials dynamically from your first and last name for instant identification.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                {activeTab === 'password' && (
                    <div className="max-w-2xl">
                        <Card className="border-[#dadce0] dark:border-[#3c4043] bg-white dark:bg-[#303134]">
                            <CardHeader className="border-b border-[#dadce0]/60 dark:border-[#3c4043]/60 pb-4">
                                <CardTitle className="text-base font-semibold text-[#202124] dark:text-[#ffffff]">
                                    Update Password
                                </CardTitle>
                                <CardDescription className="text-xs text-[#5f6368] dark:text-[#9aa0a6]">
                                    Ensure your account is using a long, random password to stay secure.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <form onSubmit={handlePasswordSubmit} className="space-y-5">
                                    {passwordForm.recentlySuccessful && (
                                        <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                                            <Check className="w-4 h-4 shrink-0" />
                                            <span>Password successfully updated.</span>
                                        </div>
                                    )}

                                    <div className="space-y-1.5">
                                        <Label htmlFor="current-password" className="text-xs font-medium text-[#202124] dark:text-[#e8eaed]">
                                            Current Password
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="current-password"
                                                type="password"
                                                value={passwordForm.data.current_password}
                                                onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                                className="pl-9 text-xs"
                                                autoComplete="current-password"
                                                required
                                            />
                                            <Lock className="w-4 h-4 text-[#5f6368] dark:text-[#9aa0a6] absolute left-3 top-1/2 -translate-y-1/2" />
                                        </div>
                                        {passwordForm.errors.current_password && (
                                            <p className="text-xs text-rose-500 flex items-center gap-1 mt-1">
                                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                                <span>{passwordForm.errors.current_password}</span>
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="new-password" className="text-xs font-medium text-[#202124] dark:text-[#e8eaed]">
                                            New Password
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="new-password"
                                                type="password"
                                                value={passwordForm.data.password}
                                                onChange={(e) => passwordForm.setData('password', e.target.value)}
                                                className="pl-9 text-xs"
                                                autoComplete="new-password"
                                                required
                                            />
                                            <KeyRound className="w-4 h-4 text-[#5f6368] dark:text-[#9aa0a6] absolute left-3 top-1/2 -translate-y-1/2" />
                                        </div>
                                        {passwordForm.errors.password && (
                                            <p className="text-xs text-rose-500 flex items-center gap-1 mt-1">
                                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                                <span>{passwordForm.errors.password}</span>
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="confirm-password" className="text-xs font-medium text-[#202124] dark:text-[#e8eaed]">
                                            Confirm New Password
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="confirm-password"
                                                type="password"
                                                value={passwordForm.data.password_confirmation}
                                                onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                                className="pl-9 text-xs"
                                                autoComplete="new-password"
                                                required
                                            />
                                            <KeyRound className="w-4 h-4 text-[#5f6368] dark:text-[#9aa0a6] absolute left-3 top-1/2 -translate-y-1/2" />
                                        </div>
                                        {passwordForm.errors.password_confirmation && (
                                            <p className="text-xs text-rose-500 flex items-center gap-1 mt-1">
                                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                                <span>{passwordForm.errors.password_confirmation}</span>
                                            </p>
                                        )}
                                    </div>

                                    <div className="pt-2 flex justify-end">
                                        <Button
                                            type="submit"
                                            disabled={passwordForm.processing}
                                            className="text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-xs"
                                        >
                                            {passwordForm.processing ? 'Updating Password...' : 'Update Password'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
