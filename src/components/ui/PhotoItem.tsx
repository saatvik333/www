import Image from 'next/image';
import styles from './PhotoItem.module.css';
import type { Photo } from '@/lib/photos';

interface PhotoItemProps {
    photo: Photo;
}

export function PhotoItem({ photo }: PhotoItemProps) {
    const imagePath = `/pics/${encodeURIComponent(photo.src)}?v=${photo.version}`;

    return (
        <div
            className={styles.photoWrapper}
            style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
        >
            {/* Native lazy loading works before hydration and without JavaScript. */}
            <a
                href={imagePath}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.imageLink}
                title="View full resolution"
            >
                <Image
                    src={imagePath}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    className={styles.image}
                    sizes="(max-width: 40rem) 100vw, (max-width: 64rem) 50vw, 33vw"
                    loading="lazy"
                />
            </a>
        </div>
    );
}
