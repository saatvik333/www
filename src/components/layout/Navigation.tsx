'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isLinkActive, navLinks } from '@/lib/navLinks';
import styles from './Navigation.module.css';
import linkStyles from './NavLink.module.css';
import { NavSymbol } from './NavSymbol';

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
              className={`${styles.navLink} ${linkStyles.navLink} ${isLinkActive(pathname, link.href) ? linkStyles.active : ''
                }`}
            >
              <NavSymbol />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
