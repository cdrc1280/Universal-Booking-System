import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from '@/components/ui/sheet';
import {
    MapPin,
    Plus,
    Clock,
    Phone,
    Mail,
    Edit2,
    Trash2,
    Building2,
} from 'lucide-react';

interface LocationItem {
    id: number;
    name: string;
    slug: string;
    timezone: string;
    address_line1?: string;
    address_line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country_code: string;
    phone?: string;
    email?: string;
    is_active: boolean;
    created_at?: string;
}

interface Props {
    locations: LocationItem[];
}

export default function LocationIndex({ locations }: Props) {
    const [editingLocation, setEditingLocation] = useState<LocationItem | null>(null);
    const [sheetOpen, setSheetOpen] = useState(false);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        slug: '',
        timezone: 'UTC',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        postal_code: '',
        country_code: 'US',
        phone: '',
        email: '',
        is_active: true,
    });

    const openCreate = () => {
        setEditingLocation(null);
        reset();
        clearErrors();
        setSheetOpen(true);
    };

    const openEdit = (location: LocationItem) => {
        setEditingLocation(location);
        clearErrors();
        setData({
            name: location.name,
            slug: location.slug,
            timezone: location.timezone,
            address_line1: location.address_line1 ?? '',
            address_line2: location.address_line2 ?? '',
            city: location.city ?? '',
            state: location.state ?? '',
            postal_code: location.postal_code ?? '',
            country_code: location.country_code,
            phone: location.phone ?? '',
            email: location.email ?? '',
            is_active: location.is_active,
        });
        setSheetOpen(true);
    };

    const closeSheet = () => {
        setSheetOpen(false);
        setEditingLocation(null);
        reset();
        clearErrors();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingLocation) {
            put(`/locations/${editingLocation.id}`, {
                onSuccess: () => closeSheet(),
            });
        } else {
            post('/locations', {
                onSuccess: () => closeSheet(),
            });
        }
    };

    const handleDelete = (location: LocationItem) => {
        if (confirm(`Are you sure you want to delete facility "${location.name}"?`)) {
            router.delete(`/locations/${location.id}`);
        }
    };

    return (
        <AppLayout title="Location & Branch Management">
            <Head title="Locations — Slotwise" />

            <div className="space-y-8 max-w-7xl mx-auto">
                {/* Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800/80 pb-6">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2.5">
                            <MapPin className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            Locations & Branches
                        </h1>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                            Configure physical facilities, timezones, and contact details for appointment scheduling.
                        </p>
                    </div>

                    <Button
                        onClick={openCreate}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium gap-1.5 shadow-xs"
                    >
                        <Plus className="w-4 h-4" />
                        Add Location
                    </Button>
                </div>

                {/* Locations Grid */}
                {locations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {locations.map((loc) => (
                            <Card key={loc.id} className="border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700/80 transition-all flex flex-col justify-between">
                                <CardHeader className="space-y-2 pb-4 border-b border-zinc-100 dark:border-zinc-800/60">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                            <CardTitle className="text-base truncate text-zinc-900 dark:text-white">{loc.name}</CardTitle>
                                        </div>
                                        {loc.is_active ? (
                                            <Badge variant="success">Active</Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-zinc-500 border-zinc-300 dark:border-zinc-700">Inactive</Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>{loc.timezone}</span>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-5 space-y-3 text-xs text-zinc-600 dark:text-zinc-300">
                                    <div className="space-y-1">
                                        <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">Address</span>
                                        {loc.address_line1 ? (
                                            <p className="text-zinc-800 dark:text-zinc-200">
                                                {loc.address_line1}
                                                {loc.city && `, ${loc.city}`}
                                                {loc.state && ` ${loc.state}`}
                                                {loc.postal_code && ` ${loc.postal_code}`}
                                            </p>
                                        ) : (
                                            <p className="text-zinc-400 italic">No physical address set</p>
                                        )}
                                    </div>

                                    {(loc.phone || loc.email) && (
                                        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/60 space-y-1 text-zinc-500 dark:text-zinc-400">
                                            {loc.phone && (
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-3.5 h-3.5 text-zinc-400" />
                                                    <span>{loc.phone}</span>
                                                </div>
                                            )}
                                            {loc.email && (
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-3.5 h-3.5 text-zinc-400" />
                                                    <span>{loc.email}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => openEdit(loc)}
                                            className="h-8 px-2.5 text-xs text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white gap-1"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(loc)}
                                            className="h-8 px-2.5 text-xs text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 gap-1"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            Delete
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="border-dashed border-zinc-300 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/20 text-center p-12">
                        <CardContent className="space-y-4">
                            <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 flex items-center justify-center mx-auto text-zinc-400">
                                <Building2 className="w-6 h-6 stroke-[1.5]" />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-zinc-900 dark:text-white">No locations configured</h3>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
                                    Start by adding your primary studio, medical clinic, or office location to enable appointment booking.
                                </p>
                            </div>
                            <Button
                                onClick={openCreate}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium gap-1.5"
                            >
                                <Plus className="w-4 h-4" />
                                Add First Location
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* shadcn Sheet Slide-Over Form */}
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                    <SheetContent side="right" className="sm:max-w-lg flex flex-col justify-between">
                        <div>
                            <SheetHeader>
                                <div className="flex items-center gap-2.5">
                                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                        <Building2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <SheetTitle>
                                            {editingLocation ? 'Edit Facility Location' : 'Register New Location'}
                                        </SheetTitle>
                                        <SheetDescription>
                                            {editingLocation
                                                ? 'Update physical facility addresses, contact details, and schedule status'
                                                : 'Add a new clinic, studio, or office branch for appointment scheduling'}
                                        </SheetDescription>
                                    </div>
                                </div>
                            </SheetHeader>

                            <form id="location-form" onSubmit={handleSubmit} className="space-y-4 py-6">
                                <div className="space-y-1.5">
                                    <Label htmlFor="loc-name" className="text-xs font-medium">Facility Name *</Label>
                                    <Input
                                        id="loc-name"
                                        value={data.name}
                                        placeholder="Main Clinic / Downtown Studio"
                                        className="text-xs h-9"
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    {errors.name && <p className="text-[11px] text-rose-500">{errors.name}</p>}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="loc-timezone" className="text-xs font-medium">IANA Timezone *</Label>
                                        <Input
                                            id="loc-timezone"
                                            value={data.timezone}
                                            placeholder="UTC, America/New_York, Asia/Manila"
                                            className="text-xs h-9"
                                            onChange={(e) => setData('timezone', e.target.value)}
                                            required
                                        />
                                        {errors.timezone && <p className="text-[11px] text-rose-500">{errors.timezone}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="loc-country" className="text-xs font-medium">Country Code *</Label>
                                        <Input
                                            id="loc-country"
                                            value={data.country_code}
                                            placeholder="US, GB, PH"
                                            maxLength={2}
                                            className="text-xs h-9"
                                            onChange={(e) => setData('country_code', e.target.value.toUpperCase())}
                                            required
                                        />
                                        {errors.country_code && <p className="text-[11px] text-rose-500">{errors.country_code}</p>}
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="loc-addr1" className="text-xs font-medium">Street Address</Label>
                                    <Input
                                        id="loc-addr1"
                                        value={data.address_line1}
                                        placeholder="123 Health Ave, Suite 400"
                                        className="text-xs h-9"
                                        onChange={(e) => setData('address_line1', e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-2.5">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="loc-city" className="text-xs font-medium">City</Label>
                                        <Input
                                            id="loc-city"
                                            value={data.city}
                                            placeholder="New York"
                                            className="text-xs h-9"
                                            onChange={(e) => setData('city', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="loc-state" className="text-xs font-medium">State / Province</Label>
                                        <Input
                                            id="loc-state"
                                            value={data.state}
                                            placeholder="NY"
                                            className="text-xs h-9"
                                            onChange={(e) => setData('state', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="loc-zip" className="text-xs font-medium">Postal Code</Label>
                                        <Input
                                            id="loc-zip"
                                            value={data.postal_code}
                                            placeholder="10001"
                                            className="text-xs h-9"
                                            onChange={(e) => setData('postal_code', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="loc-phone" className="text-xs font-medium">Phone</Label>
                                        <Input
                                            id="loc-phone"
                                            value={data.phone}
                                            placeholder="+1 (555) 000-0000"
                                            className="text-xs h-9"
                                            onChange={(e) => setData('phone', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="loc-email" className="text-xs font-medium">Contact Email</Label>
                                        <Input
                                            id="loc-email"
                                            type="email"
                                            value={data.email}
                                            placeholder="contact@facility.com"
                                            className="text-xs h-9"
                                            onChange={(e) => setData('email', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                                    <input
                                        id="loc-active"
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                        className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                    />
                                    <label htmlFor="loc-active" className="text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer select-none">
                                        Active for online scheduling & appointment booking
                                    </label>
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
                                form="location-form"
                                type="submit"
                                disabled={processing}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-9 shadow-xs"
                            >
                                {processing ? 'Saving...' : editingLocation ? 'Update Location' : 'Create Location'}
                            </Button>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>
        </AppLayout>
    );
}
