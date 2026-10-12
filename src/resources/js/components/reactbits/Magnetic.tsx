import React, { useRef, useState } from 'react';

interface MagneticProps {
    children: React.ReactElement;
    intensity?: number;
    className?: string;
}

export function Magnetic({
    children,
    intensity = 0.35,
    className = '',
}: MagneticProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current.getBoundingClientRect();

        const centerX = left + width / 2;
        const centerY = top + height / 2;

        const deltaX = (clientX - centerX) * intensity;
        const deltaY = (clientY - centerY) * intensity;

        setPosition({ x: deltaX, y: deltaY });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    return (
        <div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`inline-block transition-transform duration-200 ease-out ${className}`}
            style={{
                transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
            }}
        >
            {children}
        </div>
    );
}

export default Magnetic;
