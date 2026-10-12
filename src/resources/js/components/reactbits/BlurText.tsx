import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface BlurTextProps extends React.HTMLAttributes<HTMLHeadingElement> {
    text: string;
    delay?: number;
    className?: string;
    animateBy?: 'words' | 'letters';
}

export function BlurText({
    text,
    delay = 60,
    className = '',
    animateBy = 'words',
    ...props
}: BlurTextProps) {
    const [mounted, setMounted] = useState(false);
    const elements = animateBy === 'words' ? text.split(' ') : text.split('');

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <span className={cn('inline-flex flex-wrap gap-x-1.5', className)} {...props}>
            {elements.map((segment, index) => (
                <span
                    key={index}
                    className={cn(
                        'inline-block transition-all duration-500 ease-out',
                        mounted
                            ? 'opacity-100 blur-none translate-y-0'
                            : 'opacity-0 blur-xs translate-y-1.5'
                    )}
                    style={{
                        transitionDelay: `${index * delay}ms`,
                    }}
                >
                    {segment}
                </span>
            ))}
        </span>
    );
}

export default BlurText;
