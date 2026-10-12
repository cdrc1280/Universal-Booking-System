import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    MapPin,
    Plus,
    Clock,
    Phone,
    Mail,
    Edit2,
    Trash2,
    Building2,
    Loader2,
    CheckCircle2,
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

interface GeographicUnit {
    code: string;
    name: string;
    regionName?: string;
}

export default function LocationIndex({ locations }: Props) {
    const [editingLocation, setEditingLocation] = useState<LocationItem | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    // Cascading PSGC Geographic Data States
    const [regions, setRegions] = useState<GeographicUnit[]>([]);
    const [provinces, setProvinces] = useState<GeographicUnit[]>([]);
    const [citiesMunicipalities, setCitiesMunicipalities] = useState<GeographicUnit[]>([]);
    const [barangays, setBarangays] = useState<GeographicUnit[]>([]);

    // Selected PSGC Codes
    const [selectedRegionCode, setSelectedRegionCode] = useState<string>('');
    const [selectedProvinceCode, setSelectedProvinceCode] = useState<string>('');
    const [selectedCityMunCode, setSelectedCityMunCode] = useState<string>('');
    const [selectedBarangayCode, setSelectedBarangayCode] = useState<string>('');

    // Selected Human-Readable Names
    const [selectedRegionName, setSelectedRegionName] = useState<string>('');
    const [selectedProvinceName, setSelectedProvinceName] = useState<string>('');
    const [selectedCityMunName, setSelectedCityMunName] = useState<string>('');
    const [selectedBarangayName, setSelectedBarangayName] = useState<string>('');

    // Specific Address Detail (House/Unit/Street/Bldg)
    const [streetDetail, setStreetDetail] = useState<string>('');

    // Loading states for cascading geographic selectors
    const [loadingRegions, setLoadingRegions] = useState<boolean>(false);
    const [loadingProvinces, setLoadingProvinces] = useState<boolean>(false);
    const [loadingCities, setLoadingCities] = useState<boolean>(false);
    const [loadingBarangays, setLoadingBarangays] = useState<boolean>(false);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        slug: '',
        timezone: 'Asia/Manila',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        postal_code: '',
        country_code: 'PH',
        phone: '',
        email: '',
        is_active: true,
    });

    // Fetch initial list of PSGC regions
    useEffect(() => {
        let isMounted = true;
        setLoadingRegions(true);
        fetch('/psgc/regions')
            .then((res) => res.json())
            .then((data: GeographicUnit[]) => {
                if (isMounted) {
                    setRegions(Array.isArray(data) ? data : []);
                }
            })
            .catch(() => {
                if (isMounted) setRegions([]);
            })
            .finally(() => {
                if (isMounted) setLoadingRegions(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    // Handle Region Selection Change
    const handleRegionChange = async (regionCode: string) => {
        setSelectedRegionCode(regionCode);
        const regionObj = regions.find((r) => r.code === regionCode);
        const regName = regionObj ? (regionObj.regionName || regionObj.name) : '';
        setSelectedRegionName(regName);

        // Reset lower cascade levels
        setSelectedProvinceCode('');
        setSelectedProvinceName('');
        setSelectedCityMunCode('');
        setSelectedCityMunName('');
        setSelectedBarangayCode('');
        setSelectedBarangayName('');
        setProvinces([]);
        setCitiesMunicipalities([]);
        setBarangays([]);

        setLoadingProvinces(true);
        try {
            const res = await fetch(`/psgc/regions/${regionCode}/provinces`);
            const provList: GeographicUnit[] = await res.json();
            if (Array.isArray(provList) && provList.length > 0) {
                setProvinces(provList);
            } else {
                // If region has zero provinces (e.g. NCR), fetch cities directly for this region
                setProvinces([]);
                setLoadingCities(true);
                const cityRes = await fetch(`/psgc/cities-municipalities?region_code=${regionCode}`);
                const cityList: GeographicUnit[] = await cityRes.json();
                setCitiesMunicipalities(Array.isArray(cityList) ? cityList : []);
                setLoadingCities(false);
            }
        } catch {
            setProvinces([]);
        } finally {
            setLoadingProvinces(false);
        }
    };

    // Handle Province Selection Change
    const handleProvinceChange = async (provCode: string) => {
        setSelectedProvinceCode(provCode);
        const provObj = provinces.find((p) => p.code === provCode);
        setSelectedProvinceName(provObj ? provObj.name : '');

        // Reset city and barangay
        setSelectedCityMunCode('');
        setSelectedCityMunName('');
        setSelectedBarangayCode('');
        setSelectedBarangayName('');
        setCitiesMunicipalities([]);
        setBarangays([]);

        setLoadingCities(true);
        try {
            const res = await fetch(`/psgc/cities-municipalities?province_code=${provCode}`);
            const cityList: GeographicUnit[] = await res.json();
            setCitiesMunicipalities(Array.isArray(cityList) ? cityList : []);
        } catch {
            setCitiesMunicipalities([]);
        } finally {
            setLoadingCities(false);
        }
    };

    // Handle City or Municipality Selection Change
    const handleCityMunChange = async (cityMunCode: string) => {
        setSelectedCityMunCode(cityMunCode);
        const cityObj = citiesMunicipalities.find((c) => c.code === cityMunCode);
        const cityName = cityObj ? cityObj.name : '';
        setSelectedCityMunName(cityName);

        // Reset barangays
        setSelectedBarangayCode('');
        setSelectedBarangayName('');
        setBarangays([]);

        setLoadingBarangays(true);
        try {
            const res = await fetch(`/psgc/cities-municipalities/${cityMunCode}/barangays`);
            const brgyList: GeographicUnit[] = await res.json();
            setBarangays(Array.isArray(brgyList) ? brgyList : []);
        } catch {
            setBarangays([]);
        } finally {
            setLoadingBarangays(false);
        }
    };

    // Handle Barangay Selection Change
    const handleBarangayChange = (brgyCode: string) => {
        setSelectedBarangayCode(brgyCode);
        const brgyObj = barangays.find((b) => b.code === brgyCode);
        setSelectedBarangayName(brgyObj ? brgyObj.name : '');
    };

    // Synthesize full standard address string reactively
    useEffect(() => {
        if (data.country_code === 'PH') {
            const addressSegments: string[] = [];

            if (streetDetail.trim()) {
                addressSegments.push(streetDetail.trim());
            }
            if (selectedBarangayName) {
                addressSegments.push(`Brgy. ${selectedBarangayName}`);
            }
            if (selectedCityMunName) {
                addressSegments.push(selectedCityMunName);
            }
            if (selectedProvinceName) {
                addressSegments.push(selectedProvinceName);
            }
            if (selectedRegionName && selectedRegionName !== selectedProvinceName) {
                addressSegments.push(selectedRegionName);
            }

            const combinedFullAddress = addressSegments.join(', ');

            setData((prev) => ({
                ...prev,
                address_line1: combinedFullAddress || prev.address_line1,
                city: selectedCityMunName || prev.city,
                state: selectedProvinceName || selectedRegionName || prev.state,
            }));
        }
    }, [
        streetDetail,
        selectedBarangayName,
        selectedCityMunName,
        selectedProvinceName,
        selectedRegionName,
        data.country_code,
    ]);

    const openCreate = () => {
        setEditingLocation(null);
        reset();
        clearErrors();
        setSelectedRegionCode('');
        setSelectedProvinceCode('');
        setSelectedCityMunCode('');
        setSelectedBarangayCode('');
        setSelectedRegionName('');
        setSelectedProvinceName('');
        setSelectedCityMunName('');
        setSelectedBarangayName('');
        setStreetDetail('');
        setProvinces([]);
        setCitiesMunicipalities([]);
        setBarangays([]);
        setModalOpen(true);
    };

    const openEdit = (location: LocationItem) => {
        setEditingLocation(location);
        clearErrors();
        setStreetDetail(location.address_line2 ?? '');
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
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingLocation(null);
        reset();
        clearErrors();
        setSelectedRegionCode('');
        setSelectedProvinceCode('');
        setSelectedCityMunCode('');
        setSelectedBarangayCode('');
        setSelectedRegionName('');
        setSelectedProvinceName('');
        setSelectedCityMunName('');
        setSelectedBarangayName('');
        setStreetDetail('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Ensure address_line2 preserves street details
        const submissionData = {
            ...data,
            address_line2: streetDetail.trim() || data.address_line2,
        };

        if (editingLocation) {
            put(`/locations/${editingLocation.id}`, {
                data: submissionData,
                onSuccess: () => closeModal(),
            });
        } else {
            post('/locations', {
                data: submissionData,
                onSuccess: () => closeModal(),
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
            <Head title="Locations" />

            <div className="space-y-8 w-full">
                {/* Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#dadce0] dark:border-[#3c4043] pb-6">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-[#202124] dark:text-[#ffffff] flex items-center gap-2.5">
                            <MapPin className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            Locations & Branches
                        </h1>
                        <p className="text-sm text-[#5f6368] dark:text-[#9aa0a6] mt-1">
                            Configure physical facilities, PSA standard geographic addresses, timezones, and contact details for appointment scheduling.
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
                            <Card key={loc.id} className="border-[#dadce0] dark:border-[#3c4043] bg-white dark:bg-[#303134] hover:border-[#bdc1c6] dark:hover:border-[#5f6368] transition-all flex flex-col justify-between">
                                <CardHeader className="space-y-2 pb-4 border-b border-[#dadce0]/60 dark:border-[#3c4043]/60">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                            <CardTitle className="text-base truncate text-[#202124] dark:text-[#ffffff]">{loc.name}</CardTitle>
                                        </div>
                                        {loc.is_active ? (
                                            <Badge variant="success">Active</Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-[#5f6368] dark:text-[#9aa0a6] border-[#dadce0] dark:border-[#3c4043]">Inactive</Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-[#5f6368] dark:text-[#9aa0a6] font-mono">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>{loc.timezone}</span>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-5 space-y-3 text-xs text-[#5f6368] dark:text-[#9aa0a6]">
                                    <div className="space-y-1">
                                        <span className="text-[11px] font-medium uppercase tracking-wider text-[#5f6368] dark:text-[#9aa0a6] block">Official Address</span>
                                        {loc.address_line1 ? (
                                            <div className="space-y-1">
                                                <p className="text-[#202124] dark:text-[#e8eaed] font-medium leading-relaxed">
                                                    {loc.address_line1}
                                                </p>
                                                {loc.postal_code && (
                                                    <p className="text-[11px] text-[#5f6368] dark:text-[#9aa0a6] font-mono">
                                                        ZIP: {loc.postal_code} • {loc.country_code}
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-[#5f6368] dark:text-[#9aa0a6] italic">No physical address set</p>
                                        )}
                                    </div>

                                    {(loc.phone || loc.email) && (
                                        <div className="pt-2 border-t border-[#dadce0]/60 dark:border-[#3c4043]/60 space-y-1 text-[#5f6368] dark:text-[#9aa0a6]">
                                            {loc.phone && (
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-3.5 h-3.5 text-[#5f6368] dark:text-[#9aa0a6]" />
                                                    <span>{loc.phone}</span>
                                                </div>
                                            )}
                                            {loc.email && (
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-3.5 h-3.5 text-[#5f6368] dark:text-[#9aa0a6]" />
                                                    <span>{loc.email}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="pt-3 border-t border-[#dadce0]/60 dark:border-[#3c4043]/60 flex items-center justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => openEdit(loc)}
                                            className="h-8 px-2.5 text-xs text-[#5f6368] hover:text-[#202124] dark:text-[#9aa0a6] dark:hover:text-[#ffffff] gap-1"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(loc)}
                                            className="h-8 px-2.5 text-xs text-[#5f6368] hover:text-rose-600 dark:text-[#9aa0a6] dark:hover:text-rose-400 gap-1"
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
                    <Card className="border-dashed border-[#dadce0] dark:border-[#3c4043] bg-[#f8f9fa] dark:bg-[#202124] text-center p-12">
                        <CardContent className="space-y-4">
                            <div className="w-12 h-12 rounded-xl bg-[#f1f3f4] dark:bg-[#303134] border border-[#dadce0] dark:border-[#3c4043] flex items-center justify-center mx-auto text-[#5f6368] dark:text-[#9aa0a6]">
                                <Building2 className="w-6 h-6 stroke-[1.5]" />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-[#202124] dark:text-[#ffffff]">No locations configured</h3>
                                <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6] mt-1 max-w-sm mx-auto">
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

                {/* Pop-up Modal with PSGC Dependent Dropdown Hierarchy */}
                <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                    <DialogContent className="sm:max-w-2xl max-h-[92vh] overflow-y-auto">
                        <DialogHeader>
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                    <Building2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <DialogTitle>
                                        {editingLocation ? 'Edit Facility Location' : 'Register New Location'}
                                    </DialogTitle>
                                    <DialogDescription>
                                        Standardized PSA Geographic Code (PSGC) dependent address selection
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <form id="location-form" onSubmit={handleSubmit} className="space-y-4 py-2">
                            {/* Facility Name & Country */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="sm:col-span-2 space-y-1.5">
                                    <Label htmlFor="loc-name" className="text-xs font-medium">Facility / Branch Name *</Label>
                                    <Input
                                        id="loc-name"
                                        value={data.name}
                                        placeholder="Makati Flagship Clinic / Cebu Studio"
                                        className="text-xs h-9 bg-white dark:bg-[#202124] border-[#dadce0] dark:border-[#3c4043]"
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    {errors.name && <p className="text-[11px] text-rose-500">{errors.name}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="loc-country" className="text-xs font-medium">Country *</Label>
                                    <Select
                                        value={data.country_code}
                                        onValueChange={(val) => setData('country_code', val)}
                                    >
                                        <SelectTrigger id="loc-country" className="text-xs h-9 bg-white dark:bg-[#202124] border-[#dadce0] dark:border-[#3c4043]">
                                            <SelectValue placeholder="Select Country" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PH">Philippines (PH)</SelectItem>
                                            <SelectItem value="US">United States (US)</SelectItem>
                                            <SelectItem value="GB">United Kingdom (GB)</SelectItem>
                                            <SelectItem value="SG">Singapore (SG)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="loc-timezone" className="text-xs font-medium">IANA Timezone *</Label>
                                    <Input
                                        id="loc-timezone"
                                        value={data.timezone}
                                        placeholder="Asia/Manila, UTC, America/New_York"
                                        className="text-xs h-9 bg-white dark:bg-[#202124] border-[#dadce0] dark:border-[#3c4043]"
                                        onChange={(e) => setData('timezone', e.target.value)}
                                        required
                                    />
                                    {errors.timezone && <p className="text-[11px] text-rose-500">{errors.timezone}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="loc-zip" className="text-xs font-medium">Postal / ZIP Code</Label>
                                    <Input
                                        id="loc-zip"
                                        value={data.postal_code}
                                        placeholder="1226"
                                        className="text-xs h-9 bg-white dark:bg-[#202124] border-[#dadce0] dark:border-[#3c4043]"
                                        onChange={(e) => setData('postal_code', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* PSA PSGC Dependent Geographic Selection (Active for Philippines) */}
                            {data.country_code === 'PH' ? (
                                <div className="p-4 rounded-xl border border-[#dadce0] dark:border-[#3c4043] bg-[#f8f9fa] dark:bg-[#202124]/60 space-y-4">
                                    <div className="flex items-center justify-between border-b border-[#dadce0]/80 dark:border-[#3c4043] pb-2">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                            <span className="text-xs font-semibold uppercase tracking-wider text-[#202124] dark:text-[#ffffff]">
                                                PSA PSGC Geographic Classifier
                                            </span>
                                        </div>
                                        <span className="text-[10px] text-[#5f6368] dark:text-[#9aa0a6] font-mono">
                                            psa.gov.ph/classification/psgc
                                        </span>
                                    </div>

                                    {/* 1. Region & Province Cascades */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-medium flex items-center justify-between">
                                                <span>Region *</span>
                                                {loadingRegions && <Loader2 className="w-3 h-3 animate-spin text-emerald-600" />}
                                            </Label>
                                            <Select
                                                value={selectedRegionCode}
                                                onValueChange={handleRegionChange}
                                                disabled={loadingRegions || regions.length === 0}
                                            >
                                                <SelectTrigger className="text-xs h-9 bg-white dark:bg-[#303134] border-[#dadce0] dark:border-[#3c4043]">
                                                    <SelectValue placeholder={loadingRegions ? "Loading regions..." : "Select Region"} />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-56">
                                                    {regions.map((reg) => (
                                                        <SelectItem key={reg.code} value={reg.code}>
                                                            {reg.name} {reg.regionName ? `(${reg.regionName})` : ''}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-medium flex items-center justify-between">
                                                <span>Province</span>
                                                {loadingProvinces && <Loader2 className="w-3 h-3 animate-spin text-emerald-600" />}
                                            </Label>
                                            <Select
                                                value={selectedProvinceCode}
                                                onValueChange={handleProvinceChange}
                                                disabled={loadingProvinces || provinces.length === 0}
                                            >
                                                <SelectTrigger className="text-xs h-9 bg-white dark:bg-[#303134] border-[#dadce0] dark:border-[#3c4043]">
                                                    <SelectValue
                                                        placeholder={
                                                            loadingProvinces
                                                                ? "Loading provinces..."
                                                                : provinces.length === 0 && selectedRegionCode
                                                                ? "Special Area (NCR / Independent)"
                                                                : "Select Province"
                                                        }
                                                    />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-56">
                                                    {provinces.map((prov) => (
                                                        <SelectItem key={prov.code} value={prov.code}>
                                                            {prov.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* 2. Municipality / City & Barangay Cascades */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-medium flex items-center justify-between">
                                                <span>City / Municipality *</span>
                                                {loadingCities && <Loader2 className="w-3 h-3 animate-spin text-emerald-600" />}
                                            </Label>
                                            <Select
                                                value={selectedCityMunCode}
                                                onValueChange={handleCityMunChange}
                                                disabled={loadingCities || citiesMunicipalities.length === 0}
                                            >
                                                <SelectTrigger className="text-xs h-9 bg-white dark:bg-[#303134] border-[#dadce0] dark:border-[#3c4043]">
                                                    <SelectValue
                                                        placeholder={
                                                            loadingCities
                                                                ? "Loading cities..."
                                                                : citiesMunicipalities.length === 0
                                                                ? "Choose Region/Province First"
                                                                : "Select City or Municipality"
                                                        }
                                                    />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-56">
                                                    {citiesMunicipalities.map((city) => (
                                                        <SelectItem key={city.code} value={city.code}>
                                                            {city.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-medium flex items-center justify-between">
                                                <span>Barangay *</span>
                                                {loadingBarangays && <Loader2 className="w-3 h-3 animate-spin text-emerald-600" />}
                                            </Label>
                                            <Select
                                                value={selectedBarangayCode}
                                                onValueChange={handleBarangayChange}
                                                disabled={loadingBarangays || barangays.length === 0}
                                            >
                                                <SelectTrigger className="text-xs h-9 bg-white dark:bg-[#303134] border-[#dadce0] dark:border-[#3c4043]">
                                                    <SelectValue
                                                        placeholder={
                                                            loadingBarangays
                                                                ? "Loading barangays..."
                                                                : barangays.length === 0
                                                                ? "Choose City/Municipality First"
                                                                : "Select Barangay"
                                                        }
                                                    />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-56">
                                                    {barangays.map((brgy) => (
                                                        <SelectItem key={brgy.code} value={brgy.code}>
                                                            {brgy.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* 3. Detailed Street & Building Address */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="loc-street" className="text-xs font-medium">
                                            Street Address / Building / Unit No.
                                        </Label>
                                        <Input
                                            id="loc-street"
                                            value={streetDetail}
                                            placeholder="Unit 102, Ground Floor, Ayala Tower, Ayala Avenue"
                                            className="text-xs h-9 bg-white dark:bg-[#303134] border-[#dadce0] dark:border-[#3c4043]"
                                            onChange={(e) => setStreetDetail(e.target.value)}
                                        />
                                    </div>

                                    {/* Live Synthesized Full Address Preview */}
                                    <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/20 space-y-1">
                                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                            <span>Synthesized Full Address (Stored in System)</span>
                                        </div>
                                        <p className="text-xs font-mono text-[#202124] dark:text-[#ffffff] break-words">
                                            {data.address_line1 || 'Complete the selections above to generate standardized full address'}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                /* International Fallback Form */
                                <div className="space-y-3">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="loc-addr1" className="text-xs font-medium">Street Address</Label>
                                        <Input
                                            id="loc-addr1"
                                            value={data.address_line1}
                                            placeholder="123 Health Ave, Suite 400"
                                            className="text-xs h-9 bg-white dark:bg-[#202124] border-[#dadce0] dark:border-[#3c4043]"
                                            onChange={(e) => setData('address_line1', e.target.value)}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="loc-city" className="text-xs font-medium">City</Label>
                                            <Input
                                                id="loc-city"
                                                value={data.city}
                                                placeholder="New York"
                                                className="text-xs h-9 bg-white dark:bg-[#202124] border-[#dadce0] dark:border-[#3c4043]"
                                                onChange={(e) => setData('city', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="loc-state" className="text-xs font-medium">State / Province</Label>
                                            <Input
                                                id="loc-state"
                                                value={data.state}
                                                placeholder="NY"
                                                className="text-xs h-9 bg-white dark:bg-[#202124] border-[#dadce0] dark:border-[#3c4043]"
                                                onChange={(e) => setData('state', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Contact Details */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="loc-phone" className="text-xs font-medium">Phone</Label>
                                    <Input
                                        id="loc-phone"
                                        value={data.phone}
                                        placeholder="+63 2 8123 4567"
                                        className="text-xs h-9 bg-white dark:bg-[#202124] border-[#dadce0] dark:border-[#3c4043]"
                                        onChange={(e) => setData('phone', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="loc-email" className="text-xs font-medium">Contact Email</Label>
                                    <Input
                                        id="loc-email"
                                        type="email"
                                        value={data.email}
                                        placeholder="branch@universalbooking.ph"
                                        className="text-xs h-9 bg-white dark:bg-[#202124] border-[#dadce0] dark:border-[#3c4043]"
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 pt-2 border-t border-[#dadce0]/60 dark:border-[#3c4043]/60">
                                <input
                                    id="loc-active"
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="h-4 w-4 rounded border-[#dadce0] dark:border-[#3c4043] bg-white dark:bg-[#202124] text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                />
                                <label htmlFor="loc-active" className="text-xs text-[#5f6368] dark:text-[#9aa0a6] cursor-pointer select-none">
                                    Active for online scheduling & appointment booking
                                </label>
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
                                form="location-form"
                                type="submit"
                                disabled={processing}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-9 shadow-xs"
                            >
                                {processing ? 'Saving...' : editingLocation ? 'Update Location' : 'Create Location'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
