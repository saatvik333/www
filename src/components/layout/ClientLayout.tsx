'use client';

import { usePathname } from 'next/navigation';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
import { Navbar } from './Navbar';
import { MobileBottomNav } from './MobileBottomNav';
import { ReactNode, useRef } from 'react';
import styles from './ClientLayout.module.css';

interface ClientLayoutProps {
  children: ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);

  // Simple pathname check is sufficient now that layout structure is fixed
  const isHomepage = pathname === '/';

  return (
    <LazyMotion features={domAnimation}>
      <div className={styles.layoutWrapper}>
        <header
          ref={headerRef}
          className={`${styles.header} ${isHomepage ? styles.home : ''}`}
          inert={isHomepage ? true : undefined}
        >
          <Navbar />
        </header>

        <div className={styles.container}>
          <AnimatePresence initial={false} mode="wait">
            <m.div
              key={pathname}
              className={styles.transition}
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: {
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1]
                }
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0
                }
              }}
            >
              {children}
            </m.div>
          </AnimatePresence>
        </div>

        {/* Mobile bottom navigation - hidden on homepage */}
        <AnimatePresence>
          {!isHomepage && <MobileBottomNav key="mobile-nav" />}
        </AnimatePresence>
      </div>
    </LazyMotion>
  );
}
