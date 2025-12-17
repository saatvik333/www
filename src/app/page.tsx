import type { Metadata } from 'next';
import { Navigation } from '@/components/layout';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'home',
  description: 'hey there! i\'m saatvik, a developer interested in web dev, design, linux, and more. welcome to my website/portfolio/blog.',
};

export default function HomePage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.hero}>
          <h1 className={styles.title}>saatvik333</h1>
          <p className={styles.greeting}>
            hey there! i&apos;m saatvik, a developer interested in web dev, design, linux, and more.
          </p>
          <Navigation horizontal />
        </div>
      </div>
    </main>
  );
}
