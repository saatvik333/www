'use client';

import { usePathname } from 'next/navigation';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
import { Navbar } from './Navbar';
import { ReactNode, useMemo } from 'react';
import styles from './ClientLayout.module.css';

interface ClientLayoutProps {
  children: ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const isHomepage = pathname === '/';

  // Respect user's motion preferences
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Soft ease for gentle, buttery transitions
  const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

  return (
    <div className={styles.layoutWrapper}>
      <header
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
                  duration: prefersReducedMotion ? 0 : 0.45,
                  ease: ease
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
