'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GoArrowRight } from 'react-icons/go';
import styles from './Navigation.module.css';

interface NavLink {
  href: string;
  label: string;
}

const navLinks: NavLink[] = [
  { href: '/about', label: 'about' },
  { href: '/projects', label: 'projects' },
  { href: '/blog', label: 'blog' },
  { href: '/pics', label: 'pics' },
  { href: '/contact', label: 'contact' },
];

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
              className={`${styles.navLink} ${pathname === link.href ? styles.active : ''
                }`}
            >
              <span className={styles.symbolWrapper}>
                <span className={styles.slash}>/</span>
                <span className={styles.arrow}>
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
