'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './Logo.module.css';

interface LogoProps {
    className?: string;
    simple?: boolean;
}

export function Logo({ className, simple }: LogoProps) {
    const [dispersed, setDispersed] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Cleanup timeout on unmount to prevent memory leak
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const handleClick = () => {
        if (simple || dispersed) return;
        setDispersed(true);
        timeoutRef.current = setTimeout(() => setDispersed(false), 800);
    };

    return (
        <div
            className={`${styles.container} ${className || ''} ${simple ? styles.simple : ''} ${dispersed ? styles.dispersed : ''}`}
            aria-hidden="true"
            onClick={simple ? undefined : handleClick}
            style={simple ? undefined : { cursor: 'pointer' }}
        >
            <svg className={styles.three} viewBox="0 0 100 200" shapeRendering="geometricPrecision" focusable="false">
                <path d="M 35 40 A 35 35 0 1 1 55 100 A 35 35 0 1 1 35 160" />
            </svg>

            <svg className={styles.three} viewBox="0 0 100 200" shapeRendering="geometricPrecision" focusable="false">
                <path d="M 35 40 A 35 35 0 1 1 55 100 A 35 35 0 1 1 35 160" />
            </svg>

            <svg className={styles.three} viewBox="0 0 100 200" shapeRendering="geometricPrecision" focusable="false">
                <path d="M 35 40 A 35 35 0 1 1 55 100 A 35 35 0 1 1 35 160" />
            </svg>
        </div>
    );
}

