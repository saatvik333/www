'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { m } from 'framer-motion';
import { Logo } from '@/components/ui';
import { navLinks } from '@/lib/navLinks';
import styles from './MobileBottomNav.module.css';

export function MobileBottomNav() {
    const pathname = usePathname();

    return (
        <m.nav
            className={styles.bottomNav}
            aria-label="Mobile navigation"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
            {/* Left section: Logo */}
            <Link href="/" className={styles.logoSection} aria-label="saatvik333 - Go to homepage">
                <Logo className={styles.logo} />
            </Link>

            <span className={styles.separator} aria-hidden="true">│</span>

            {/* Navigation links */}
            <ul className={styles.navLinks}>
                {navLinks.map((link) => {
                    const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                    return (
                        <li key={link.href} className={styles.linkWrapper}>
                            <Link
                                href={link.href}
                                className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                                aria-current={isActive ? 'page' : undefined}
                            >
                                {link.label}
                            </Link>
                            <span className={styles.separator} aria-hidden="true">│</span>
                        </li>
                    );
                })}
            </ul>
        </m.nav>
    );
}
