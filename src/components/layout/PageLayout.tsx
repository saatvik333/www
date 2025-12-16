import styles from './PageLayout.module.css';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  wide?: boolean;
}

// Parse title to style the [number] part differently
function formatTitle(title: string) {
  const match = title.match(/^(.+?)(\[\d+\])$/);
  if (match) {
    return (
      <>
        {match[1]}<span className={styles.titleNumber}>{match[2]}</span>
      </>
    );
  }
  return title;
}

export function PageLayout({ children, title, wide = false }: PageLayoutProps) {
  return (
    <main className={styles.main}>
      <div className={`${styles.container} ${wide ? styles.wide : ''}`}>
        <h1 className={styles.title}>{formatTitle(title)}</h1>
        {children}
      </div>
    </main>
  );
}
