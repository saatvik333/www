import type { Metadata } from 'next';
import { Navigation } from '@/components/layout';
import { Logo } from '@/components/ui/Logo';
import styles from './page.module.css';

export const metadata: Metadata = {
  // absolute: the root layout template would otherwise append "| saatvik333"
  title: { absolute: 'Saatvik Sharma | Forward Deployed Engineer' },
  description:
    'Forward deployed engineer building and shipping software in the field — full-stack systems, Linux tooling, and automation that solve real problems.',
  alternates: {
    canonical: '/',
  },
};

export default function HomePage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.hero}>
          <div className={styles.headerWrapper}>
            <h1 className={styles.title}>Saatvik Sharma</h1>
            <Logo />
          </div>
          <p className={styles.greeting}>
            hey, i&apos;m saatvik — i enjoy linux and solving problems with software.
          </p>
          <Navigation horizontal />
        </div>
      </div>
    </main>
  );
}
