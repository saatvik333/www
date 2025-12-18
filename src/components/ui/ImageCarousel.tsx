'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { GoArrowLeft, GoArrowRight } from 'react-icons/go';
import styles from './ImageCarousel.module.css';

interface ImageCarouselProps {
  images: string[];
  alt: string;
}

// Physics-based spring solver for Apple-like feel
// Stiffness: 150 (snappy), Damping: 20 (bouncy but controlled), Mass: 1
function springScrollTo({
  element,
  targetPosition,
  onComplete,
}: {
  element: HTMLElement;
  targetPosition: number;
  onComplete?: () => void;
}): () => void {
  const startPosition = element.scrollLeft;
  const distance = targetPosition - startPosition;
  const stiffness = 150;
  const damping = 20;
  const mass = 1;
  const epsilon = 0.5; // Stop when within 0.5px

  let velocity = 0;
  let currentPos = startPosition;
  let animationId: number;
  let isCancelled = false;
  let lastTime = performance.now();

  function animate(currentTime: number) {
    if (isCancelled) return;

    const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.05); // Cap dt
    lastTime = currentTime;

    const force = -stiffness * (currentPos - targetPosition);
    const acceleration = force / mass;
    const friction = -damping * velocity;

    velocity += (acceleration + friction) * deltaTime;
    currentPos += velocity * deltaTime;

    element.scrollLeft = currentPos;

    // Check if stopped
    if (Math.abs(velocity) < 1 && Math.abs(currentPos - targetPosition) < epsilon) {
      element.scrollLeft = targetPosition;
      onComplete?.();
    } else {
      animationId = requestAnimationFrame(animate);
    }
  }

  animationId = requestAnimationFrame(animate);

  return () => {
    isCancelled = true;
    cancelAnimationFrame(animationId);
  };
}

export function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Triple buffer: [Set 1] [Set 2 (Middle)] [Set 3] - sufficient for seamless infinite loop
  const extendedImages = [...images, ...images, ...images];
  const middleSetStart = images.length;
  const middleSetEnd = images.length * 2 - 1;
  const setLength = images.length;

  // Animation state
  const animationRef = useRef<(() => void) | null>(null);
  const isAnimating = useRef(false);
  const destinationIndexRef = useRef<number | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getCenteredSlideIndex = useCallback(() => {
    if (!containerRef.current) return middleSetStart;
    const container = containerRef.current;

    const slides = Array.from(container.children) as HTMLElement[];
    const center = container.scrollLeft + container.clientWidth / 2;

    let closestIndex = 0;
    let minDiff = Infinity;

    slides.forEach((slide, index) => {
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      const diff = Math.abs(slideCenter - center);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = index;
      }
    });

    return closestIndex;
  }, [middleSetStart]);

  const getScrollPositionForSlide = useCallback((index: number) => {
    if (!containerRef.current) return 0;
    const container = containerRef.current;
    const slides = Array.from(container.children) as HTMLElement[];
    const slide = slides[index];
    if (!slide) return 0;
    return slide.offsetLeft + slide.offsetWidth / 2 - container.clientWidth / 2;
  }, []);

  // Teleport the CURRENT VIEWPORT (and destination) to the middle set
  const teleportToMiddleSet = useCallback((currentVisualIndex: number) => {
    if (!containerRef.current) return currentVisualIndex;
    const container = containerRef.current;

    if (currentVisualIndex >= middleSetStart && currentVisualIndex <= middleSetEnd) {
      return currentVisualIndex;
    }

    const relativeIndex = currentVisualIndex % setLength;
    const targetIndex = middleSetStart + relativeIndex;

    const currentSlidePos = getScrollPositionForSlide(currentVisualIndex);
    const currentScroll = container.scrollLeft;
    const offset = currentScroll - currentSlidePos;

    const targetSlidePos = getScrollPositionForSlide(targetIndex);
    const newScroll = targetSlidePos + offset;

    // Temporarily disable snap/scroll-behavior for instant teleport
    container.style.scrollSnapType = 'none';
    container.style.scrollBehavior = 'auto';

    container.scrollLeft = newScroll;

    // Force reflow
    void container.offsetWidth;

    // Re-enable snap
    container.style.scrollSnapType = 'x mandatory';
    container.style.scrollBehavior = '';

    return targetIndex;
  }, [setLength, middleSetStart, middleSetEnd, getScrollPositionForSlide]);

  // Init
  const initScroll = useCallback(() => {
    if (!containerRef.current || images.length === 0) return;

    if (isMobile) {
      setIsReady(true);
      return;
    }

    const container = containerRef.current;
    const targetPos = getScrollPositionForSlide(middleSetStart);
    container.scrollLeft = targetPos;

    requestAnimationFrame(() => setIsReady(true));
  }, [images.length, isMobile, middleSetStart, getScrollPositionForSlide]);

  useEffect(() => {
    const timer = setTimeout(initScroll, 50);
    return () => clearTimeout(timer);
  }, [initScroll]);

  // Debounced scroll handler to maintain infinite loop
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // We only care about teleporting when scroll effectively STOPS or hits edges
    // Native momentum might still be going!
    // But we must teleport if we hit the physical edges or drift too far.

    // 1. Debounce for "Snap to center" logic cleanup
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    // Check limits periodically
    scrollTimeoutRef.current = setTimeout(() => {
      if (isAnimating.current) return;
      const currentIndex = getCenteredSlideIndex();

      // Teleport if we are in the buffer sets (Set 1 or Set 3)
      if (currentIndex < setLength || currentIndex >= setLength * 2) {
        teleportToMiddleSet(currentIndex);
      }
    }, 150);

    // 2. SAFETY CHECK: If close to physical limit, teleport IMMEDIATELY
    // This allows continuing momentum without hitting a wall
    const center = container.scrollLeft + container.clientWidth / 2;
    const scrollWidth = container.scrollWidth;
    const approxProgress = center / scrollWidth; // 0 to 1

    // If < 15% (Start of Set 1) or > 85% (End of Set 3)
    if (approxProgress < 0.15 || approxProgress > 0.85) {
      const currentIndex = getCenteredSlideIndex();
      // Only teleport if we are actually significantly off-center
      if (currentIndex < setLength || currentIndex >= setLength * 2) {
        teleportToMiddleSet(currentIndex);
      }
    }
  }, [getCenteredSlideIndex, teleportToMiddleSet, setLength]);

  const navigate = useCallback((direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // Temporarily disable scroll snap for the spring animation
    container.style.scrollSnapType = 'none';

    if (animationRef.current) {
      animationRef.current();
      animationRef.current = null;
    }

    let baseIndex = getCenteredSlideIndex();

    // If animating and close to destination, use that as base
    if (isAnimating.current && destinationIndexRef.current !== null) {
      const destPos = getScrollPositionForSlide(destinationIndexRef.current);
      const currentPos = container.scrollLeft;
      const distToDestination = Math.abs(destPos - currentPos);
      const slideWidth = container.children[0]?.clientWidth || 300;

      if (distToDestination < slideWidth * 0.4) {
        baseIndex = destinationIndexRef.current;
      }
    }

    // Boundary check for infinite navigation
    if (baseIndex < setLength || baseIndex >= setLength * 2) {
      const currentVisual = getCenteredSlideIndex();
      const newVisual = teleportToMiddleSet(currentVisual);
      const diff = baseIndex - currentVisual;
      baseIndex = newVisual + diff;
    }

    // Ensure snap is disabled before animation starts
    // (teleportToMiddleSet re-enables it, which causes the skip glitch)
    container.style.scrollSnapType = 'none';

    let targetIndex = direction === 'right' ? baseIndex + 1 : baseIndex - 1;

    destinationIndexRef.current = targetIndex;
    isAnimating.current = true;

    const targetPos = getScrollPositionForSlide(targetIndex);

    animationRef.current = springScrollTo({
      element: container,
      targetPosition: targetPos,
      onComplete: () => {
        isAnimating.current = false;
        animationRef.current = null;
        destinationIndexRef.current = null;

        container.style.scrollSnapType = 'x mandatory';

        const finalIndex = getCenteredSlideIndex();
        if (finalIndex < middleSetStart || finalIndex > middleSetEnd) {
          teleportToMiddleSet(finalIndex);
        }
      },
    });

  }, [getCenteredSlideIndex, getScrollPositionForSlide, middleSetStart, middleSetEnd, setLength, teleportToMiddleSet]);

  if (images.length === 0) return null;

  return (
    <div className={`${styles.carousel} ${isReady ? styles.ready : ''}`}>
      <div
        ref={containerRef}
        className={styles.container}
        onScroll={handleScroll}
      >
        {extendedImages.map((image, index) => (
          <div
            key={`${index}-${image}`}
            className={styles.slide}
          >
            <Image
              src={image}
              alt={`${alt} - image ${(index % images.length) + 1}`}
              width={1200}
              height={700}
              className={styles.image}
              priority={index >= middleSetStart && index <= middleSetEnd}
            />
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate('left')}
        className={`${styles.arrow} ${styles.arrowLeft}`}
        aria-label="Previous image"
      >
        <GoArrowLeft />
      </button>
      <button
        onClick={() => navigate('right')}
        className={`${styles.arrow} ${styles.arrowRight}`}
        aria-label="Next image"
      >
        <GoArrowRight />
      </button>
    </div>
  );
}
