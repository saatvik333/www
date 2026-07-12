'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/ui';
import { isLinkActive, navLinks } from '@/lib/navLinks';
import styles from './Navbar.module.css';
import linkStyles from './NavLink.module.css';
import { NavSymbol } from './NavSymbol';

export function Navbar() {
  const pathname = usePathname();

  return (
    <>
      <div className={styles.row}>
        <Link href="/" className={styles.logo} aria-label="saatvik333 - Go to homepage">
          <Logo className={styles.navLogo} />
          saatvik333
        </Link>
      </div>
      <nav className={styles.nav} aria-label="Main navigation">
        {navLinks.map((link) => {
          const isActive = isLinkActive(pathname, link.href);
          return (
          <Link
            key={link.href}
            href={link.href}
            className={`${linkStyles.navLink} ${isActive ? linkStyles.active : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            <NavSymbol />
            {link.label}
          </Link>
          );
        })}
      </nav>
    </>
  );
}
