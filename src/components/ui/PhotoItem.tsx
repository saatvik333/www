'use client';

import Image from 'next/image';
import { useRef, useState, memo } from 'react';
import { useIntersectionObserver } from '@/lib/useIntersectionObserver';
import styles from './PhotoItem.module.css';
import type { Photo } from '@/lib/photos';

interface PhotoItemProps {
    photo: Photo;
    index: number;
}

export const PhotoItem = memo(function PhotoItem({ photo, index }: PhotoItemProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Use shared observer for better performance with many photos
    const isVisible = useIntersectionObserver(ref);

    return (
        <div
            ref={ref}
            className={`${styles.photoWrapper} ${isVisible ? styles.visible : ''} ${isLoaded ? styles.loaded : ''}`}
            style={{
                animationDelay: `${index * 0.03}s`,
                aspectRatio: `${photo.width} / ${photo.height}`,
            }}
        >
            {/* Placeholder */}
            <div className={styles.placeholder} />

            {/* Image - only render when in viewport */}
            {isVisible && (
                <Image
                    src={`/pics/${photo.src}`}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    className={styles.image}
                    onLoad={() => setIsLoaded(true)}
                    sizes="(max-width: 40rem) 100vw, (max-width: 64rem) 50vw, 33vw"
                    loading="lazy"
                    quality={75}
                />
            )}
        </div>
    );
});
