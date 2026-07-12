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
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        setDispersed(true);
        // Fallback only — animationend is the primary reset path. Generous
        // margin over the 0.8s animation for throttled/background tabs.
        timeoutRef.current = setTimeout(() => {
            timeoutRef.current = null;
            setDispersed(false);
        }, 1200);
    };

    const handleAnimationEnd = () => {
        // The disperse animations are the only finite ones in this subtree
        // (rotate1-3 and spin are infinite and never fire animationend).
        if (!dispersed) return;
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setDispersed(false);
    };

    return (
        <div
            className={`${styles.container} ${className || ''} ${simple ? styles.simple : ''} ${dispersed ? styles.dispersed : ''}`}
            aria-hidden="true"
            onClick={simple ? undefined : handleClick}
            onAnimationEnd={simple ? undefined : handleAnimationEnd}
            style={simple ? undefined : { cursor: 'pointer' }}
        >
            <div className={styles.arm}>
                <svg className={styles.three} viewBox="0 0 100 200" shapeRendering="geometricPrecision" focusable="false">
                    <path d="M 35 40 A 35 35 0 1 1 55 100 A 35 35 0 1 1 35 160" />
                </svg>
            </div>

            <div className={styles.arm}>
                <svg className={styles.three} viewBox="0 0 100 200" shapeRendering="geometricPrecision" focusable="false">
                    <path d="M 35 40 A 35 35 0 1 1 55 100 A 35 35 0 1 1 35 160" />
                </svg>
            </div>

            <div className={styles.arm}>
                <svg className={styles.three} viewBox="0 0 100 200" shapeRendering="geometricPrecision" focusable="false">
                    <path d="M 35 40 A 35 35 0 1 1 55 100 A 35 35 0 1 1 35 160" />
                </svg>
            </div>
        </div>
    );
}
