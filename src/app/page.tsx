import type { Metadata } from 'next';
import { Navigation } from '@/components/layout';
import { Logo } from '@/components/ui';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Saatvik Sharma | Creative Developer & Designer',
  description: 'Portfolio of Saatvik Sharma, a creative developer and designer based in India, specializing in React, Next.js, and modern web design.',
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
            hey there! i&apos;m saatvik, a developer interested in web dev, design, linux, and more.
          </p>
          <Navigation horizontal />
        </div>
      </div>
    </main>
  );
}
