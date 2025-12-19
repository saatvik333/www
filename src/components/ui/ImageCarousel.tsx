'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { GoArrowLeft, GoArrowRight } from 'react-icons/go';
import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import styles from './ImageCarousel.module.css';

interface ImageCarouselProps {
  images: string[];
  alt: string;
}

export function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const [isReady, setIsReady] = useState(false);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'center',
      containScroll: false,
      dragFree: false,
      duration: 25,
    },
    [WheelGesturesPlugin()]
  );

  useEffect(() => {
    if (emblaApi) {
      // Mark as ready once Embla is initialized
      setIsReady(true);
    }
  }, [emblaApi]);

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

      <button
        onClick={scrollPrev}
        className={`${styles.arrow} ${styles.arrowLeft}`}
        aria-label="Previous image"
      >
        <GoArrowLeft />
      </button>
      <button
        onClick={scrollNext}
        className={`${styles.arrow} ${styles.arrowRight}`}
        aria-label="Next image"
      >
        <GoArrowRight />
      </button>
    </div>
  );
}
