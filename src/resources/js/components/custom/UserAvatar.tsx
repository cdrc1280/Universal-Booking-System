import React from 'react';
import { cn } from '@/lib/utils';

interface UserAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    name?: string | null;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function getInitials(name?: string | null): string {
    if (!name) return 'U';

    const segments = name.trim().split(/\s+/).filter(Boolean);

    if (segments.length === 0) return 'U';
    if (segments.length === 1) return segments[0].substring(0, 2).toUpperCase();

    const firstInitial = segments[0][0];
    const lastInitial = segments[segments.length - 1][0];

    return `${firstInitial}${lastInitial}`.toUpperCase();
}

export function UserAvatar({
    name,
    size = 'md',
    className,
    ...props
}: UserAvatarProps) {
    const initials = getInitials(name);

    const sizeClasses = {
        sm: 'w-7 h-7 text-[11px]',
        md: 'w-8 h-8 text-xs',
        lg: 'w-12 h-12 text-sm',
    };

    return (
        <div
            className={cn(
                'rounded-lg shrink-0 flex items-center justify-center font-mono font-semibold select-none border transition-colors',
                'bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100/70',
                'dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/40 dark:hover:bg-emerald-900/60',
                sizeClasses[size],
                className
            )}
            title={name ?? 'User Profile'}
            aria-label={name ?? 'User Profile'}
            {...props}
        >
            <span>{initials}</span>
        </div>
    );
}
