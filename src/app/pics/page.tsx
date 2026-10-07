import type { Metadata } from 'next';
import { PageLayout } from '@/components/layout';
import { getPhotos } from '@/lib/photos';
import { PhotoItem } from '@/components/ui/PhotoItem';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Photography',
  description: 'A personal photo gallery by Saatvik Sharma — candid moments, places, and everyday scenes captured on camera.',
  alternates: {
    canonical: '/pics',
  },
};

export default async function PicsPage() {
  const photos = await getPhotos();
  const hasPhotos = photos.length > 0;

  return (
    <PageLayout title={`pics[${photos.length}]`} wide>
      <section className={styles.content}>
        <p className={styles.description}>just some random photos i clicked.</p>

        {hasPhotos ? (
          <div className={styles.galleryWrapper}>
            <div className={styles.gallery}>
              {photos.map((photo) => (
                <PhotoItem key={photo.id} photo={photo} />
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
