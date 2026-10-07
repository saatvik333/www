'use client';

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
  const scrollPrev = () => {
    if (emblaApi) emblaApi.scrollPrev();
  };

  const scrollNext = () => {
    if (emblaApi) emblaApi.scrollNext();
  };

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
                sizes="(max-width: 48rem) 85vw, 90vw"
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <>
          <div className={styles.navZoneLeft}>
            <button
              className={styles.arrow}
              aria-label="Previous image"
              onClick={scrollPrev}
            >
              <span className={styles.arrowIcon}>
                <GoArrowLeft />
              </span>
            </button>
          </div>
          <div className={styles.navZoneRight}>
            <button
              className={styles.arrow}
              aria-label="Next image"
              onClick={scrollNext}
            >
              <span className={styles.arrowIcon}>
                <GoArrowRight />
              </span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
