import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    MapPin,
    Users,
    Shield,
    LogOut,
    CalendarCheck,
    PanelLeftClose,
    PanelLeftOpen,
} from 'lucide-react';
import { useSidebar, SidebarProvider } from '@/context/SidebarContext';
import { useTheme, ThemeProvider } from '@/context/ThemeContext';
import { ThemeToggle } from '@/components/custom/ThemeToggle';
import { UserMenuDropdown } from '@/components/custom/UserMenuDropdown';
import { Button } from '@/components/ui/button';
import { ShinyText, Magnetic } from '@/components/reactbits';

interface NavItem {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    active: boolean;
}

interface AppLayoutProps {
    children: React.ReactNode;
    title?: string;
}

function AppLayoutContent({ children, title }: AppLayoutProps) {
    const { url, props } = usePage();
    const { isCollapsed, toggleSidebar } = useSidebar();
    const authProps = props as Record<string, unknown>;
    const user = (authProps.auth as { user?: { name?: string; email?: string } } | undefined)?.user;

    const navItems: NavItem[] = [
        {
            label: 'Command Center',
            href: '/dashboard',
            icon: CalendarCheck,
            active: url === '/dashboard',
        },
        {
            label: 'Locations',
            href: '/locations',
            icon: MapPin,
            active: url.startsWith('/locations'),
        },
        {
            label: 'Staff Directory',
            href: '/users',
            icon: Users,
            active: url.startsWith('/users'),
        },
        {
            label: 'Access Control',
            href: '/roles',
            icon: Shield,
            active: url.startsWith('/roles'),
        },
    ];

    const currentNav = navItems.find((item) => item.active);
    const headerTitle = title ?? currentNav?.label ?? 'Overview';

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200 selection:bg-emerald-500 selection:text-white">
            <div className="flex flex-1 min-h-screen">
                {/* Lateral Sidebar Navigation */}
                <aside
                    className={`${
                        isCollapsed ? 'w-18' : 'w-64'
                    } border-r border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 backdrop-blur-md flex flex-col justify-between shrink-0 transition-[width] duration-300 ease-in-out`}
                >
                    <div className="p-3.5 space-y-6">
                        {/* Application Branding & Collapse Toggle */}
                        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-2'} h-10`}>
                            <Link href="/dashboard" className="flex items-center gap-3 min-w-0">
                                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                                    <CalendarCheck className="w-5 h-5" />
                                </div>
                                {!isCollapsed && (
                                    <div className="min-w-0">
                                        <ShinyText text="Universal Booking" speed={4} className="text-sm font-semibold tracking-tight block truncate" />
                                        <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block truncate">
                                            Appointment Platform
                                        </span>
                                    </div>
                                )}
                            </Link>

                            {!isCollapsed && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={toggleSidebar}
                                    className="h-7 w-7 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                                    title="Collapse sidebar"
                                >
                                    <PanelLeftClose className="w-4 h-4" />
                                </Button>
                            )}
                        </div>

                        {/* Collapsed expansion trigger button */}
                        {isCollapsed && (
                            <div className="flex justify-center">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={toggleSidebar}
                                    className="h-8 w-8 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                                    title="Expand sidebar"
                                >
                                    <PanelLeftOpen className="w-4 h-4" />
                                </Button>
                            </div>
                        )}

                        {/* Navigation Menu Links */}
                        <nav className="space-y-1">
                            {!isCollapsed && (
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 px-2 block mb-2">
                                    Management
                                </span>
                            )}
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        title={isCollapsed ? item.label : undefined}
                                        className={`flex items-center ${
                                            isCollapsed ? 'justify-center px-0' : 'px-3'
                                        } py-2 rounded-lg text-xs font-medium transition-all ${
                                            item.active
                                                ? 'bg-zinc-100 dark:bg-zinc-800/90 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700/50 shadow-xs'
                                                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/40'
                                        }`}
                                    >
                                        <Icon className={`w-4 h-4 shrink-0 ${item.active ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-500 dark:text-zinc-400'}`} />
                                        {!isCollapsed && <span className="ml-3 truncate">{item.label}</span>}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Clean Sidebar Footer */}
                    <div className="p-3 border-t border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30">
                        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'px-2'} gap-2 text-zinc-400 dark:text-zinc-500`}>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                            {!isCollapsed && (
                                <span className="text-[11px] font-mono tracking-tight text-zinc-500 dark:text-zinc-400 truncate">
                                    Core System
                                </span>
                            )}
                        </div>
                    </div>
                </aside>

                {/* Main Viewport Column */}
                <div className="flex-1 flex flex-col min-w-0 min-h-screen">
                    {/* Top App Header Rail */}
                    <header className="h-14 border-b border-zinc-200 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/20 backdrop-blur-xs flex items-center justify-between px-6 sm:px-8 shrink-0 sticky top-0 z-40 transition-colors">
                        <div className="flex items-center gap-3">
                            <h2 className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                                {headerTitle}
                            </h2>
                        </div>

                        <div className="flex items-center gap-3">
                            <Magnetic intensity={0.25}>
                                <ThemeToggle />
                            </Magnetic>
                            <UserMenuDropdown />
                        </div>
                    </header>

                    {/* Page Viewport Area */}
                    <main className="flex-1 p-6 sm:p-8">
                        {children}
                    </main>

                    {/* Clean Footer */}
                    <footer className="border-t border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 px-6 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400 shrink-0 transition-colors">
                        <div>
                            <span>Universal Booking</span>
                        </div>
                        <div>
                            <span>Appointment & Scheduling Platform</span>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}

export default function AppLayout(props: AppLayoutProps) {
    return (
        <ThemeProvider>
            <SidebarProvider>
                <AppLayoutContent {...props} />
            </SidebarProvider>
        </ThemeProvider>
    );
}
