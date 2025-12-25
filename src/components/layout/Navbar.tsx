'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GoArrowRight } from 'react-icons/go';
import { Logo } from '@/components/ui';
import { navLinks } from '@/lib/navLinks';
import styles from './Navbar.module.css';
import linkStyles from './NavLink.module.css';

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
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`${linkStyles.navLink} ${pathname === link.href || pathname.startsWith(link.href + '/') ? linkStyles.active : ''
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
        ))}
      </nav>
    </>
  );
}
