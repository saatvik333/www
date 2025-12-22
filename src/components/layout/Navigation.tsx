'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GoArrowRight } from 'react-icons/go';
import { navLinks } from '@/lib/navLinks';
import styles from './Navigation.module.css';
import linkStyles from './NavLink.module.css';

interface NavigationProps {
  horizontal?: boolean;
}

export function Navigation({ horizontal = false }: NavigationProps) {
  const pathname = usePathname();

  return (
    <nav className={`${styles.nav} ${horizontal ? styles.horizontal : ''}`} aria-label="Main navigation">
      <ul className={`${styles.navList} ${horizontal ? styles.horizontalList : ''}`}>
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`${styles.navLink} ${linkStyles.navLink} ${pathname === link.href || pathname.startsWith(link.href + '/') ? `${styles.active} ${linkStyles.active}` : ''
                }`}
            >
              <span className={linkStyles.symbolWrapper}>
                <span className={linkStyles.slash}>/</span>
                <span className={linkStyles.arrow}>
                  <GoArrowRight />
                </span>
              </span>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
