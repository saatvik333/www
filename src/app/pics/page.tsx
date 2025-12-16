import type { Metadata } from 'next';
import { PageLayout } from '@/components/layout';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'pics',
  description: 'just some random photos.',
};

const photos = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  color: `hsl(${(i * 30) % 360}, 60%, 20%)`,
}));

export default function PicsPage() {
  return (
    <PageLayout title={`pics[${photos.length}]`} wide>
      <section className={styles.content}>
        <p className={styles.description}>just some random photos.</p>
        
        <div className={styles.gallery}>
          {photos.map((photo, index) => (
            <div 
              key={photo.id} 
              className={styles.photoWrapper}
              style={{ 
                animationDelay: `${index * 0.03}s`,
                backgroundColor: photo.color 
              }}
            >
              <div className={styles.photoPlaceholder}>
                <span className={styles.photoNumber}>{photo.id}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
