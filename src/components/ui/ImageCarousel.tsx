'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { GoChevronLeft, GoChevronRight } from 'react-icons/go';
import styles from './ImageCarousel.module.css';

interface ImageCarouselProps {
  images: string[];
  alt: string;
}

export function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToIndex = useCallback((index: number) => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.clientWidth * index;
      containerRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth',
      });
      setCurrentIndex(index);
    }
  }, []);

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    scrollToIndex(newIndex);
  };

  const goToNext = () => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    scrollToIndex(newIndex);
  };

  const handleScroll = () => {
    if (containerRef.current) {
      const scrollLeft = containerRef.current.scrollLeft;
      const width = containerRef.current.clientWidth;
      const newIndex = Math.round(scrollLeft / width);
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
      }
    }
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <div className={styles.carousel}>
      <div
        ref={containerRef}
        className={styles.container}
        onScroll={handleScroll}
      >
        {images.map((image, index) => (
          <div key={image} className={styles.slide}>
            <Image
              src={image}
              alt={`${alt} - image ${index + 1}`}
              fill
              className={styles.image}
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          {/* Navigation arrows */}
          <button
            onClick={goToPrevious}
            className={`${styles.arrow} ${styles.arrowLeft}`}
            aria-label="Previous image"
          >
            <GoChevronLeft />
          </button>
          <button
            onClick={goToNext}
            className={`${styles.arrow} ${styles.arrowRight}`}
            aria-label="Next image"
          >
            <GoChevronRight />
          </button>

          {/* Dot indicators */}
          <div className={styles.dots}>
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                className={`${styles.dot} ${index === currentIndex ? styles.dotActive : ''}`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
