import Link from 'next/link';
import { GoArrowRight } from 'react-icons/go';
import styles from './ArrowLink.module.css';

interface ArrowLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}

export function ArrowLink({ href, children, className = '', external = false }: ArrowLinkProps) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.link} ${className}`}
      >
        {children}
        <span className={styles.arrow}>&gt;</span>
      </a>
    );
  }

  return (
    <Link href={href} className={`${styles.link} ${className}`}>
      <GoArrowRight className={styles.arrow} />
      {children}
    </Link>
  );
}
