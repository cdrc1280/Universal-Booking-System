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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { ShinyText } from '@/components/reactbits';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

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

interface FlashProps {
    success?: string | null;
    error?: string | null;
    warning?: string | null;
    info?: string | null;
}

function AppLayoutContent({ children, title }: AppLayoutProps) {
    const { url, props } = usePage();
    const { isCollapsed, toggleSidebar } = useSidebar();
    const { theme } = useTheme();
    const authProps = props as Record<string, unknown>;
    const user = (authProps.auth as { user?: { name?: string; email?: string } } | undefined)?.user;
    const flash = authProps.flash as FlashProps | undefined;

    // Listen for Laravel flash messages on every Inertia page update
    React.useEffect(() => {
        if (!flash) return;

        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
        if (flash.warning) {
            toast.warning(flash.warning);
        }
        if (flash.info) {
            toast.info(flash.info);
        }
    }, [flash]);

    const mainNavItems: NavItem[] = [
        {
            label: 'Dashboard',
            href: '/dashboard',
            icon: CalendarCheck,
            active: url === '/dashboard',
        },
        {
            label: 'Branches',
            href: '/locations',
            icon: MapPin,
            active: url.startsWith('/locations'),
        },
    ];

    const adminNavItems: NavItem[] = [
        {
            label: 'Staff',
            href: '/users',
            icon: Users,
            active: url.startsWith('/users'),
        },
        {
            label: 'Roles & Permissions',
            href: '/roles',
            icon: Shield,
            active: url.startsWith('/roles'),
        },
    ];

    const currentNav = [...mainNavItems, ...adminNavItems].find((item) => item.active);
    const headerTitle = title ?? currentNav?.label ?? 'Overview';

    return (
        <div className="h-screen w-screen overflow-hidden bg-[#f8f9fa] dark:bg-[#202124] text-[#202124] dark:text-[#e8eaed] flex flex-col font-sans transition-colors duration-200 selection:bg-emerald-500 selection:text-white">
            <div className="flex flex-1 h-full overflow-hidden">
                {/* Lateral Sidebar Navigation - Fixed height with zero outer overflow */}
                <aside
                    className={`${
                        isCollapsed ? 'w-18' : 'w-64'
                    } h-full border-r border-[#dadce0] dark:border-[#3c4043] bg-white dark:bg-[#202124] flex flex-col shrink-0 transition-[width] duration-300 ease-in-out select-none overflow-hidden`}
                >
                    {/* Fixed Sidebar Brand Header */}
                    <div className="p-3.5 border-b border-[#dadce0]/60 dark:border-[#3c4043]/60 shrink-0">
                        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-2'} h-10`}>
                            <Link href="/dashboard" className="flex items-center gap-3 min-w-0">
                                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                                    <CalendarCheck className="w-5 h-5" />
                                </div>
                                {!isCollapsed && (
                                    <div className="min-w-0">
                                        <ShinyText text="Universal Booking" speed={4} className="text-sm font-semibold tracking-tight block truncate" />
                                        <span className="text-[11px] text-[#5f6368] dark:text-[#9aa0a6] block truncate">
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
                                    className="h-7 w-7 text-[#5f6368] hover:text-[#202124] dark:text-[#9aa0a6] dark:hover:text-[#ffffff] cursor-pointer"
                                    title="Collapse sidebar"
                                >
                                    <PanelLeftClose className="w-4 h-4" />
                                </Button>
                            )}
                        </div>

                        {/* Collapsed expansion trigger button */}
                        {isCollapsed && (
                            <div className="flex justify-center mt-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={toggleSidebar}
                                    className="h-8 w-8 text-[#5f6368] hover:text-[#202124] dark:text-[#9aa0a6] dark:hover:text-[#ffffff] cursor-pointer"
                                    title="Expand sidebar"
                                >
                                    <PanelLeftOpen className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Main Sidebar Nav Container - Flex-1, scrollable, perfect fit */}
                    <div className="flex-1 overflow-y-auto overflow-x-hidden p-3.5 space-y-2 min-h-0">
                        <nav className="space-y-1">
                            {!isCollapsed && (
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#5f6368] dark:text-[#9aa0a6] px-2 block mb-1.5">
                                    Navigation
                                </span>
                            )}
                            {mainNavItems.map((item) => {
                                const Icon = item.icon;
                                const linkElement = (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center ${
                                            isCollapsed ? 'justify-center px-0 w-10 h-10 mx-auto' : 'px-3 py-2'
                                        } rounded-lg text-xs font-medium transition-all ${
                                            item.active
                                                ? 'bg-[#f1f3f4] dark:bg-[#303134] text-[#202124] dark:text-[#ffffff] border border-[#dadce0] dark:border-[#3c4043] shadow-xs'
                                                : 'text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#202124] dark:hover:text-[#ffffff] hover:bg-[#f1f3f4] dark:hover:bg-[#303134]/80'
                                        }`}
                                    >
                                        <Icon className={`w-4 h-4 shrink-0 ${item.active ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#5f6368] dark:text-[#9aa0a6]'}`} />
                                        {!isCollapsed && <span className="ml-3 truncate">{item.label}</span>}
                                    </Link>
                                );

                                if (isCollapsed) {
                                    return (
                                        <Tooltip key={item.href}>
                                            <TooltipTrigger asChild>
                                                {linkElement}
                                            </TooltipTrigger>
                                            <TooltipContent side="right" sideOffset={10}>
                                                {item.label}
                                            </TooltipContent>
                                        </Tooltip>
                                    );
                                }

                                return linkElement;
                            })}
                        </nav>
                    </div>

                    {/* Administration Navigation Footer */}
                    <div className="border-t border-[#dadce0] dark:border-[#3c4043] bg-[#f8f9fa]/80 dark:bg-[#202124]/90 shrink-0 flex flex-col pb-2">
                        <div className="px-3.5 pt-3 pb-1 flex items-center justify-between">
                            {!isCollapsed ? (
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#5f6368] dark:text-[#9aa0a6] px-2 flex items-center gap-1.5">
                                    <Shield className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                    Administration
                                </span>
                            ) : (
                                <div className="w-full flex justify-center">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Administration" />
                                </div>
                            )}
                        </div>

                        {/* Admin Nav List */}
                        <div className="px-3.5 py-1.5 space-y-1">
                            {adminNavItems.map((item) => {
                                const Icon = item.icon;
                                const adminLinkElement = (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center ${
                                            isCollapsed ? 'justify-center px-0 w-9 h-9 mx-auto' : 'px-3 py-1.5'
                                        } rounded-lg text-xs font-medium transition-all ${
                                            item.active
                                                ? 'bg-[#f1f3f4] dark:bg-[#303134] text-[#202124] dark:text-[#ffffff] border border-[#dadce0] dark:border-[#3c4043] shadow-xs'
                                                : 'text-[#5f6368] dark:text-[#9aa0a6] hover:text-[#202124] dark:hover:text-[#ffffff] hover:bg-[#f1f3f4] dark:hover:bg-[#303134]/80'
                                        }`}
                                    >
                                        <Icon className={`w-3.5 h-3.5 shrink-0 ${item.active ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#5f6368] dark:text-[#9aa0a6]'}`} />
                                        {!isCollapsed && <span className="ml-2.5 truncate">{item.label}</span>}
                                    </Link>
                                );

                                if (isCollapsed) {
                                    return (
                                        <Tooltip key={item.href}>
                                            <TooltipTrigger asChild>
                                                {adminLinkElement}
                                            </TooltipTrigger>
                                            <TooltipContent side="right" sideOffset={10}>
                                                {item.label}
                                            </TooltipContent>
                                        </Tooltip>
                                    );
                                }

                                return adminLinkElement;
                            })}
                        </div>
                    </div>
                </aside>

                {/* Main Viewport Column - Fits 100vh with smooth scrollable page area */}
                <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                    {/* Top App Header Rail */}
                    <header className="h-14 border-b border-[#dadce0] dark:border-[#3c4043] bg-white/80 dark:bg-[#202124]/90 backdrop-blur-xs flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-40 transition-colors">
                        <div className="flex items-center gap-3">
                            <h2 className="text-sm font-medium text-[#202124] dark:text-[#e8eaed]">
                                {headerTitle}
                            </h2>
                        </div>

                        <div className="flex items-center gap-3">
                            <ThemeToggle />
                            <UserMenuDropdown />
                        </div>
                    </header>

                    {/* Page Viewport Area - Scrollable */}
                    <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col">
                        <main className="flex-1 p-4 sm:p-6 w-full">
                            {children}
                        </main>

                        {/* Clean Footer */}
                        <footer className="border-t border-[#dadce0] dark:border-[#3c4043] bg-white dark:bg-[#202124] px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#5f6368] dark:text-[#9aa0a6] shrink-0 transition-colors">
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

            {/* Global Bottom-Right Flash Toast Notification System */}
            <Toaster theme={theme === 'dark' ? 'dark' : 'light'} />
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
