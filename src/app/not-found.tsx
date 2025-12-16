'use client';

import Link from 'next/link';
import { GoArrowLeft } from 'react-icons/go';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.code}>404</h1>
        <p className={styles.message}>page not found</p>
        <Link href="/" className={styles.homeLink}>
          <GoArrowLeft className={styles.arrow} /> back home
        </Link>
      </div>
    </main>
  );
}
