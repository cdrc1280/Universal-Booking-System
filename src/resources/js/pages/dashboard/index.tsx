import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SpotlightCard, BlurText, GridPattern } from '@/components/reactbits';
import {
    Calendar,
    Users,
    Clock,
    DollarSign,
    ArrowUpRight,
    Activity,
    Inbox,
    MapPin,
    Shield
} from 'lucide-react';

interface MetricItem {
    label: string;
    value: string | number;
    subtext: string;
    icon: React.ComponentType<{ className?: string }>;
}

interface RecentBooking {
    id: number;
    reference: string;
    customer_name: string;
    service_name: string;
    time_window: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    price_formatted: string;
}

interface Props {
    metrics?: {
        total_bookings: number;
        active_staff: number;
        services_count: number;
        revenue_in_cents: number;
    };
    recent_bookings?: RecentBooking[];
}

export default function Dashboard({ metrics, recent_bookings = [] }: Props) {
    const stats: MetricItem[] = [
        {
            label: 'Total Bookings',
            value: metrics?.total_bookings ?? 0,
            subtext: 'All time reservations',
            icon: Clock,
        },
        {
            label: 'Staff Members',
            value: metrics?.active_staff ?? 0,
            subtext: 'Active service providers',
            icon: Users,
        },
        {
            label: 'Services',
            value: metrics?.services_count ?? 0,
            subtext: 'Configured catalog services',
            icon: Calendar,
        },
        {
            label: 'Revenue',
            value: `$${((metrics?.revenue_in_cents ?? 0) / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            subtext: 'Recorded total',
            icon: DollarSign,
        },
    ];

    const statusBadge = (status: RecentBooking['status']) => {
        switch (status) {
            case 'confirmed':
                return <Badge variant="success">Confirmed</Badge>;
            case 'pending':
                return <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800/40">Pending</Badge>;
            case 'completed':
                return <Badge variant="outline">Completed</Badge>;
            case 'cancelled':
                return <Badge variant="destructive">Cancelled</Badge>;
        }
    };

    return (
        <AppLayout title="Dashboard">
            <Head title="Dashboard" />

            <div className="space-y-8 max-w-7xl mx-auto">
                {/* Header Welcome Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800/80 pb-6">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2.5">
                            <Activity className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <BlurText text="Overview" className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white" />
                        </h1>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                            System activity, schedule utilization, and active appointments.
                        </p>
                    </div>
                </div>

                {/* Metric Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <SpotlightCard
                                key={i}
                                className="p-5 space-y-3 hover:border-zinc-300 dark:hover:border-zinc-700/80 transition-colors"
                            >
                                <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
                                    <span className="text-xs font-medium uppercase tracking-wider">{stat.label}</span>
                                    <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/40 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
                                        <Icon className="w-4 h-4" />
                                    </div>
                                </div>
                                <div>
                                    <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white font-mono block">
                                        {stat.value}
                                    </span>
                                    <div className="text-[11px] text-zinc-500 mt-1">
                                        <span>{stat.subtext}</span>
                                    </div>
                                </div>
                            </SpotlightCard>
                        );
                    })}
                </div>

                {/* Primary Content Split: Appointments Feed & Quick Links */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Real Bookings Feed (2 cols) */}
                    <Card className="lg:col-span-2 border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-200 dark:border-zinc-800/80 pb-4">
                            <div>
                                <CardTitle className="text-base font-semibold text-zinc-900 dark:text-white">Recent Appointments</CardTitle>
                                <CardDescription className="text-xs mt-0.5 text-zinc-500 dark:text-zinc-400">
                                    Appointments booked across all locations.
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {recent_bookings.length > 0 ? (
                                <div className="divide-y divide-zinc-200 dark:divide-zinc-800/60">
                                    {recent_bookings.map((b) => (
                                        <div key={b.id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors">
                                            <div className="space-y-1 min-w-0 pr-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-zinc-900 dark:text-white text-sm truncate">{b.customer_name}</span>
                                                    <span className="text-[11px] font-mono text-zinc-500 bg-zinc-100 dark:bg-zinc-800/60 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700/40">
                                                        {b.reference}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-zinc-600 dark:text-zinc-400 truncate">{b.service_name}</p>
                                                <p className="text-[11px] text-zinc-500 font-mono">{b.time_window}</p>
                                            </div>

                                            <div className="flex flex-col items-end gap-1.5 shrink-0">
                                                <span className="font-mono text-sm font-semibold text-zinc-900 dark:text-white">
                                                    {b.price_formatted}
                                                </span>
                                                {statusBadge(b.status)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="relative overflow-hidden p-12 text-center space-y-3">
                                    <GridPattern className="opacity-35 [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]" />
                                    <div className="relative z-10 w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/50 flex items-center justify-center mx-auto text-zinc-400 dark:text-zinc-500">
                                        <Inbox className="w-5 h-5" />
                                    </div>
                                    <div className="relative z-10 space-y-1">
                                        <h3 className="text-sm font-medium text-zinc-800 dark:text-zinc-300">No appointments recorded</h3>
                                        <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                                            New customer bookings will appear here.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Navigation Rail (1 col) */}
                    <div className="space-y-6">
                        <Card className="border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50">
                            <CardHeader className="pb-3 border-b border-zinc-200 dark:border-zinc-800/80">
                                <CardTitle className="text-sm font-semibold text-zinc-900 dark:text-white">Quick Navigation</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-3 space-y-2">
                                <Link href="/locations" className="block">
                                    <Button variant="outline" className="w-full justify-between text-xs border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                        <span className="flex items-center gap-2">
                                            <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                                            Locations & Branches
                                        </span>
                                        <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
                                    </Button>
                                </Link>
                                <Link href="/users" className="block">
                                    <Button variant="outline" className="w-full justify-between text-xs border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                        <span className="flex items-center gap-2">
                                            <Users className="w-3.5 h-3.5 text-zinc-500" />
                                            Staff Directory
                                        </span>
                                        <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
                                    </Button>
                                </Link>
                                <Link href="/roles" className="block">
                                    <Button variant="outline" className="w-full justify-between text-xs border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                        <span className="flex items-center gap-2">
                                            <Shield className="w-3.5 h-3.5 text-zinc-500" />
                                            Access Control & Roles
                                        </span>
                                        <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
