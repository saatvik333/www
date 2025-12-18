'use client';

import { usePathname } from 'next/navigation';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
import { Navbar } from './Navbar';
import { useNavigation } from '@/context/NavigationContext';
import { ReactNode, useMemo } from 'react';
import styles from './ClientLayout.module.css';

// Navigation order matching refact0r.dev
const pages = [
  { name: 'about', path: '/about' },
  { name: 'projects', path: '/projects' },
  { name: 'blog', path: '/blog' },
  { name: 'pics', path: '/pics' },
  { name: 'contact', path: '/contact' }
];

// Smooth cubic-bezier curve (ease-out-expo feel)
const smoothEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface ClientLayoutProps {
  children: ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const { previousPath } = useNavigation();
  const isHomepage = pathname === '/';
  const wasHomepage = previousPath === '/';

  // Respect user's motion preferences
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Calculate transition exactly like refact0r.dev
  const getAnimationValues = () => {
    const cleanPath = pathname.replace(/\/$/, '');
    const cleanPrevPath = (previousPath || '').replace(/\/$/, '');

    let currDepth = cleanPath.split('/').length;
    let prevDepth = cleanPrevPath.split('/').length;

    const currParent = '/' + cleanPath.split('/')[1];
    const prevParent = '/' + cleanPrevPath.split('/')[1];

    let currParentIdx = pages.findIndex((page) => page.path === currParent);
    let prevParentIdx = pages.findIndex((page) => page.path === prevParent);

    // Homepage special handling
    if (pathname === '/') {
      currParentIdx = prevParentIdx;
      currDepth = 1;
    }
    if (previousPath === '/') {
      prevParentIdx = currParentIdx;
      prevDepth = 1;
    }

    const xDiff = currParentIdx - prevParentIdx;
    const yDiff = currDepth - prevDepth;

    return { xDiff, yDiff };
  };

  const { xDiff, yDiff } = getAnimationValues();

  // Use larger movement for homepage transitions, smaller for between pages
  const isHomepageTransition = isHomepage || wasHomepage;
  const moveScale = isHomepageTransition ? 15 : 20; // vh

  // Reduced motion: instant transitions
  const duration = prefersReducedMotion ? 0 : 0.25;
  const exitDuration = prefersReducedMotion ? 0 : 0.2;

  return (
    <div className={styles.layoutWrapper}>
      <header className={`${styles.header} ${isHomepage ? styles.home : ''}`}>
        <Navbar />
      </header>

      <div className={styles.container}>
        <LazyMotion features={domAnimation}>
          <AnimatePresence mode="popLayout" initial={false}>
            <m.div
              key={pathname}
              className={styles.transition}
              style={{ willChange: 'transform, opacity' }}
              initial={{
                x: `${xDiff * moveScale}vh`,
                y: `${yDiff * moveScale}vh`,
                opacity: 0
              }}
              animate={{
                x: 0,
                y: 0,
                opacity: 1,
                transition: {
                  duration,
                  delay: prefersReducedMotion ? 0 : 0.03,
                  ease: smoothEase,
                }
              }}
              exit={{
                x: `${-xDiff * moveScale}vh`,
                y: `${-yDiff * moveScale}vh`,
                opacity: 0,
                transition: {
                  duration: exitDuration,
                  delay: 0,
                  ease: smoothEase,
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
