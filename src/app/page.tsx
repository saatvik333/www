import type { Metadata } from 'next';
import { Navigation } from '@/components/layout';
import { Logo } from '@/components/ui';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Saatvik Sharma | I build software',
  description: 'Portfolio of Saatvik Sharma, a software engineer who enjoys linux and solving problems with software',
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
            <h1 className={styles.title} style={{ marginBottom: 0 }}>saatvik333</h1>
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
