'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { MobileBottomNav } from './MobileBottomNav';
import { ReactNode } from 'react';
import styles from './ClientLayout.module.css';

interface ClientLayoutProps {
  children: ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();

  // Simple pathname check is sufficient now that layout structure is fixed
  const isHomepage = pathname === '/';

  return (
    <div className={styles.layoutWrapper}>
      <header
        className={`${styles.header} ${isHomepage ? styles.home : ''}`}
        inert={isHomepage ? true : undefined}
      >
        <Navbar />
      </header>

      <div className={styles.container}>
        {/* key={pathname} remounts on navigation so the CSS fade-in replays */}
        <div key={pathname} className={`${styles.transition} ${styles.pageEnter}`}>
          {children}
        </div>
      </div>

      {/* Mobile bottom navigation - hidden on homepage */}
      {!isHomepage && <MobileBottomNav key="mobile-nav" />}
    </div>
  );
}
