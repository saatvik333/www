import type { Metadata } from 'next';
import { PageLayout } from '@/components/layout';
import { getPhotos } from '@/lib/photos';
import { PhotoItem } from '@/components/ui/PhotoItem';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'pics',
  description: 'just some random photos.',
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
