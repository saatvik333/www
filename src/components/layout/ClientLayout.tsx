'use client';

import { usePathname } from 'next/navigation';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
import { Navbar } from './Navbar';
import { ReactNode, useState, useEffect, useRef } from 'react';
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
    <div className={styles.layoutWrapper}>
      <header
        ref={headerRef}
        className={`${styles.header} ${isHomepage ? styles.home : ''}`}
        inert={isHomepage ? true : undefined}
      >
        <Navbar />
      </header>

      <div className={styles.container}>
        <LazyMotion features={domAnimation}>
          <AnimatePresence initial={false} mode="wait">
            <m.div
              key={pathname}
              className={styles.transition}
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: {
                  duration: 0.45,
                  ease: [0.25, 0.1, 0.25, 1]
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
        </LazyMotion>
      </div>
    </div>
  );
}
