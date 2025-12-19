import React from 'react';
import styles from './Logo.module.css';

interface LogoProps {
    className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => {
    return (
        <div className={`${styles.container} ${className || ''}`}>
            <svg className={styles.three} viewBox="0 0 100 200" shapeRendering="geometricPrecision">
                <path d="M 35 40 A 35 35 0 1 1 55 100 A 35 35 0 1 1 35 160" />
            </svg>

            <svg className={styles.three} viewBox="0 0 100 200" shapeRendering="geometricPrecision">
                <path d="M 35 40 A 35 35 0 1 1 55 100 A 35 35 0 1 1 35 160" />
            </svg>

            <svg className={styles.three} viewBox="0 0 100 200" shapeRendering="geometricPrecision">
                <path d="M 35 40 A 35 35 0 1 1 55 100 A 35 35 0 1 1 35 160" />
            </svg>
        </div>
    );
};
