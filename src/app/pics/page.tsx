import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { PageLayout } from '@/components/layout';
import { getPhotos } from '@/lib/photos';
import styles from './page.module.css';

// Dynamic import - defers loading until Pics page is visited
const PhotoItem = dynamic(
  () => import('@/components/ui/PhotoItem').then(mod => mod.PhotoItem)
);

export const metadata: Metadata = {
  title: 'Pics',
  description: 'just some random photos.',
  alternates: {
    canonical: '/pics',
  },
};

export default function PicsPage() {
  const photos = getPhotos();
  const hasPhotos = photos.length > 0;

  return (
    <PageLayout title={`pics[${photos.length}]`} wide>
      <section className={styles.content}>
        <p className={styles.description}>just some random photos.</p>

        {hasPhotos ? (
          <div className={styles.galleryWrapper}>
            <div className={styles.gallery}>
              {photos.map((photo, index) => (
                <PhotoItem key={photo.id} photo={photo} index={index} />
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>
              no photos yet. just drop images in <code>/public/pics/</code>
            </p>
          </div>
        )}
      </section>
    </PageLayout>
  );
}
