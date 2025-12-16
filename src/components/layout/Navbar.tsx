'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
import { GoArrowRight } from 'react-icons/go';

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

export function Navbar() {
  const pathname = usePathname();

  return (
    <>
      <div className={styles.row}>
        <Link href="/" className={styles.logo}>
          saatvik333
        </Link>
      </div>
      <nav className={styles.nav} aria-label="Main navigation">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`${styles.navLink} ${
              pathname === link.href || pathname.startsWith(link.href + '/') ? styles.active : ''
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
        ))}
      </nav>
    </>
  );
}
