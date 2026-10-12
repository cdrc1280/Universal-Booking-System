import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    MapPin,
    Plus,
    Clock,
    Phone,
    Mail,
    Edit2,
    Trash2,
    X,
    Check,
    Globe,
    Building2,
    ShieldAlert
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
    const [isCreating, setIsCreating] = useState(false);

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
        setIsCreating(true);
    };

    const openEdit = (location: LocationItem) => {
        setIsCreating(false);
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
    };

    const closeModal = () => {
        setIsCreating(false);
        setEditingLocation(null);
        reset();
        clearErrors();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingLocation) {
            put(`/locations/${editingLocation.id}`, {
                onSuccess: () => closeModal(),
            });
        } else {
            post('/locations', {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (location: LocationItem) => {
        if (confirm(`Are you sure you want to delete "${location.name}"?`)) {
            router.delete(`/locations/${location.id}`);
        }
    };

    return (
        <AppLayout title="Location & Branch Management">
            <Head title="Locations — Slotwise" />

            <div className="space-y-8 max-w-7xl mx-auto">
                {/* Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
                            <MapPin className="w-6 h-6 text-emerald-400" />
                            Locations & Branches
                        </h1>
                        <p className="text-sm text-zinc-400 mt-1">
                            Configure physical facilities, timezones, and contact details for appointment scheduling.
                        </p>
                    </div>

                    <Button
                        onClick={openCreate}
                        className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-medium"
                    >
                        <Plus className="w-4 h-4 mr-1.5" />
                        Add New Location
                    </Button>
                </div>

                {/* Locations Grid */}
                {locations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {locations.map((loc) => (
                            <Card key={loc.id} className="border-zinc-800/80 bg-zinc-900/50 hover:border-zinc-700/80 transition-all flex flex-col justify-between">
                                <CardHeader className="space-y-2 pb-4 border-b border-zinc-800/60">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="w-4 h-4 text-emerald-400" />
                                            <CardTitle className="text-base truncate">{loc.name}</CardTitle>
                                        </div>
                                        {loc.is_active ? (
                                            <Badge variant="success">Active</Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-zinc-500 border-zinc-700">Inactive</Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                                        <span>{loc.timezone}</span>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-5 space-y-3 text-xs text-zinc-300">
                                    <div className="space-y-1">
                                        <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 block">Address</span>
                                        {loc.address_line1 ? (
                                            <p className="text-zinc-300">
                                                {loc.address_line1}
                                                {loc.city && `, ${loc.city}`}
                                                {loc.state && ` ${loc.state}`}
                                                {loc.postal_code && ` ${loc.postal_code}`}
                                            </p>
                                        ) : (
                                            <p className="text-zinc-600 italic">No physical address set</p>
                                        )}
                                    </div>

                                    {(loc.phone || loc.email) && (
                                        <div className="pt-2 border-t border-zinc-800/50 space-y-1.5">
                                            {loc.phone && (
                                                <div className="flex items-center gap-2 text-zinc-400">
                                                    <Phone className="w-3.5 h-3.5 text-zinc-500" />
                                                    <span>{loc.phone}</span>
                                                </div>
                                            )}
                                            {loc.email && (
                                                <div className="flex items-center gap-2 text-zinc-400">
                                                    <Mail className="w-3.5 h-3.5 text-zinc-500" />
                                                    <span>{loc.email}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardContent>

                                <div className="p-4 bg-zinc-950/40 border-t border-zinc-800/60 flex items-center justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => openEdit(loc)}
                                        className="h-8 text-xs border-zinc-800 hover:bg-zinc-800 text-zinc-300"
                                    >
                                        <Edit2 className="w-3.5 h-3.5 mr-1" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(loc)}
                                        className="h-8 text-xs bg-rose-950/60 hover:bg-rose-900 border border-rose-800/50 text-rose-300"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="border-zinc-800/80 bg-zinc-900/40 p-12 text-center">
                        <div className="w-12 h-12 rounded-xl bg-zinc-800/60 border border-zinc-700/50 flex items-center justify-center mx-auto text-zinc-500 mb-3">
                            <MapPin className="w-6 h-6 text-zinc-400" />
                        </div>
                        <h3 className="text-base font-semibold text-white">No locations registered</h3>
                        <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1 mb-6">
                            Create your first physical branch or clinic location to start assigning staff shifts and services.
                        </p>
                        <Button
                            onClick={openCreate}
                            className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-medium"
                        >
                            <Plus className="w-4 h-4 mr-1.5" />
                            Create First Location
                        </Button>
                    </Card>
                )}

                {/* Create / Edit Modal Sheet */}
                {(isCreating || editingLocation) && (
                    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
                        <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95">
                            <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
                                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-emerald-400" />
                                    {editingLocation ? 'Edit Facility Location' : 'Register New Location'}
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                                <div className="space-y-1.5">
                                    <Label htmlFor="loc-name">Facility Name *</Label>
                                    <Input
                                        id="loc-name"
                                        value={data.name}
                                        placeholder="Main Clinic / Downtown Studio"
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="loc-timezone">IANA Timezone *</Label>
                                        <Input
                                            id="loc-timezone"
                                            value={data.timezone}
                                            placeholder="UTC, America/New_York, Asia/Manila"
                                            onChange={(e) => setData('timezone', e.target.value)}
                                            required
                                        />
                                        {errors.timezone && <p className="text-xs text-rose-400 mt-1">{errors.timezone}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="loc-country">Country Code *</Label>
                                        <Input
                                            id="loc-country"
                                            value={data.country_code}
                                            placeholder="US, GB, PH"
                                            maxLength={2}
                                            onChange={(e) => setData('country_code', e.target.value.toUpperCase())}
                                            required
                                        />
                                        {errors.country_code && <p className="text-xs text-rose-400 mt-1">{errors.country_code}</p>}
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="loc-addr1">Street Address</Label>
                                    <Input
                                        id="loc-addr1"
                                        value={data.address_line1}
                                        placeholder="123 Health Ave, Suite 400"
                                        onChange={(e) => setData('address_line1', e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="loc-city">City</Label>
                                        <Input
                                            id="loc-city"
                                            value={data.city}
                                            placeholder="New York"
                                            onChange={(e) => setData('city', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="loc-state">State / Province</Label>
                                        <Input
                                            id="loc-state"
                                            value={data.state}
                                            placeholder="NY"
                                            onChange={(e) => setData('state', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="loc-zip">Postal Code</Label>
                                        <Input
                                            id="loc-zip"
                                            value={data.postal_code}
                                            placeholder="10001"
                                            onChange={(e) => setData('postal_code', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="loc-phone">Phone</Label>
                                        <Input
                                            id="loc-phone"
                                            value={data.phone}
                                            placeholder="+1 (555) 000-0000"
                                            onChange={(e) => setData('phone', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="loc-email">Contact Email</Label>
                                        <Input
                                            id="loc-email"
                                            type="email"
                                            value={data.email}
                                            placeholder="contact@facility.com"
                                            onChange={(e) => setData('email', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 pt-2">
                                    <input
                                        id="loc-active"
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                        className="h-4 w-4 rounded border-zinc-700 bg-zinc-950 text-emerald-500 focus:ring-emerald-400 focus:ring-offset-zinc-900 cursor-pointer"
                                    />
                                    <label htmlFor="loc-active" className="text-xs text-zinc-300 cursor-pointer select-none">
                                        Active for online scheduling & appointment booking
                                    </label>
                                </div>

                                <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={closeModal}
                                        className="border-zinc-800 text-xs"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-medium"
                                    >
                                        {processing ? 'Saving...' : editingLocation ? 'Update Location' : 'Create Location'}
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
