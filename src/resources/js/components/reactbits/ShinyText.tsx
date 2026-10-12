import React from 'react';
import { cn } from '@/lib/utils';

interface ShinyTextProps extends React.HTMLAttributes<HTMLSpanElement> {
    text: string;
    disabled?: boolean;
    speed?: number;
    className?: string;
}

export function ShinyText({
    text,
    disabled = false,
    speed = 4,
    className = '',
    ...props
}: ShinyTextProps) {
    if (disabled) {
        return <span className={className} {...props}>{text}</span>;
    }

    return (
        <span
            className={cn(
                'inline-block bg-clip-text text-transparent bg-[linear-gradient(120deg,rgba(16,185,129,0.7)_0%,rgba(52,211,153,1)_50%,rgba(16,185,129,0.7)_100%)] bg-[length:250%_100%] animate-shine font-semibold',
                className
            )}
            style={{
                animationDuration: `${speed}s`,
            }}
            {...props}
        >
            {text}
        </span>
    );
}

export default ShinyText;
