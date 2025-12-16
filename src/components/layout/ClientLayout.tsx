'use client';

import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './Navbar';
import { useNavigation } from '@/context/NavigationContext';
import { ReactNode } from 'react';
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

  return (
    <div className={styles.layoutWrapper}>
      <header className={`${styles.header} ${isHomepage ? styles.home : ''}`}>
        <Navbar />
      </header>
      
      <div className={styles.container}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={pathname}
            className={styles.transition}
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
                duration: 0.25,
                delay: 0.03,
                ease: smoothEase,
              }
            }}
            exit={{ 
              x: `${-xDiff * moveScale}vh`, 
              y: `${-yDiff * moveScale}vh`, 
              opacity: 0,
              transition: {
                duration: 0.2,
                delay: 0,
                ease: smoothEase,
              }
            }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
