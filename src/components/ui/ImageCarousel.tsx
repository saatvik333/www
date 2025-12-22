'use client';

import { useCallback } from 'react';
import Image from 'next/image';
import { GoArrowLeft, GoArrowRight } from 'react-icons/go';
import useEmblaCarousel from 'embla-carousel-react';
import styles from './ImageCarousel.module.css';

interface ImageCarouselProps {
  images: string[];
  alt: string;
}

export function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    containScroll: false,
    dragFree: false,
    duration: 30, // Slower deceleration for smoother feel
    // skipSnaps: false, // Smoother free scrolling
  });

  const isReady = !!emblaApi;

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (images.length === 0) return null;

  return (
    <div className={`${styles.carousel} ${isReady ? styles.ready : ''}`}>
      <div ref={emblaRef} className={styles.viewport}>
        <div className={styles.container}>
          {images.map((image, index) => (
            <div key={`${index}-${image}`} className={styles.slide}>
              <Image
                src={image}
                alt={`${alt} - image ${index + 1}`}
                width={1200}
                height={700}
                className={styles.image}
                loading="eager"
              />
            </div>
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <>
          <div className={styles.navZoneLeft}>
            <button
              onClick={scrollPrev}
              className={styles.arrow}
              aria-label="Previous image"
            >
              <GoArrowLeft />
            </button>
          </div>
          <div className={styles.navZoneRight}>
            <button
              onClick={scrollNext}
              className={styles.arrow}
              aria-label="Next image"
            >
              <GoArrowRight />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
