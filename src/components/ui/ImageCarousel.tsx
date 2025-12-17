'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { GoArrowLeft, GoArrowRight } from 'react-icons/go';
import styles from './ImageCarousel.module.css';

interface ImageCarouselProps {
  images: string[];
  alt: string;
}

// Custom cubic-bezier easing function: cubic-bezier(0.25, 1, 0.5, 1) - "Soft Out"
// Adjusted for a premium, responsive feel (fast start, smooth end)
function cubicBezier(t: number, p1x: number, p1y: number, p2x: number, p2y: number): number {
  let x = t;
  // Newton-Raphson
  for (let i = 0; i < 8; i++) {
    const cx = 3 * (1 - x) * (1 - x) * x * p1x + 3 * (1 - x) * x * x * p2x + x * x * x - t;
    if (Math.abs(cx) < 0.001) break;
    const d = 3 * (1 - x) * (1 - x) * p1x + 6 * (1 - x) * x * (p2x - p1x) + 3 * x * x * (1 - p2x); 
    // Simplified derivative approx for the typical range
    if (Math.abs(d) < 0.001) break;
    x -= cx / d;
  }
  const oneMinusX = 1 - x;
  return 3 * oneMinusX * oneMinusX * x * p1y + 3 * oneMinusX * x * x * p2y + x * x * x;
}

function smoothScrollTo(
  element: HTMLElement,
  targetPosition: number,
  duration: number,
  onComplete?: () => void
): () => void {
  const startPosition = element.scrollLeft;
  const distance = targetPosition - startPosition;
  const startTime = performance.now();
  let animationId: number;
  let isCancelled = false;

  // Premium easing curve: cubic-bezier(0.25, 1, 0.5, 1) - "Soft Out"
  const easeValue = (t: number) => cubicBezier(t, 0.25, 1, 0.5, 1);

  function animate(currentTime: number) {
    if (isCancelled) return;
    
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeValue(progress);

    element.scrollLeft = startPosition + distance * easedProgress;

    if (progress < 1) {
      animationId = requestAnimationFrame(animate);
    } else {
      onComplete?.();
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
  
  // Quintuple buffer: [Set 1] [Set 2] [Set 3 (Middle)] [Set 4] [Set 5]
  const extendedImages = [...images, ...images, ...images, ...images, ...images];
  const middleSetStart = images.length * 2;
  const middleSetEnd = images.length * 3 - 1;
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
    
    // Simple logic: index = round((scrollLeft + width/2) / slideWidth) 
    // IF absolute positioning. But here slides can be flexible.
    // Iteration is safer.
    const slides = Array.from(container.children) as HTMLElement[];
    const center = container.scrollLeft + container.clientWidth / 2;
    
    let closestIndex = 0;
    let minDiff = Infinity;
    
    // Optimization: start search from expected area if possible, but linear is fine for < 100 items
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
  // Returns the new equivalent index
  const teleportToMiddleSet = useCallback((currentVisualIndex: number) => {
    if (!containerRef.current) return currentVisualIndex;
    const container = containerRef.current;
    
    if (currentVisualIndex >= middleSetStart && currentVisualIndex <= middleSetEnd) {
      return currentVisualIndex;
    }
    
    const relativeIndex = currentVisualIndex % setLength;
    const targetIndex = middleSetStart + relativeIndex;
    
    // Calculate precise offset to maintain sub-pixel position
    const currentSlidePos = getScrollPositionForSlide(currentVisualIndex);
    const currentScroll = container.scrollLeft;
    const offset = currentScroll - currentSlidePos;
    
    const targetSlidePos = getScrollPositionForSlide(targetIndex);
    const newScroll = targetSlidePos + offset;
    
    // Disable Snap & Smooth
    container.style.scrollSnapType = 'none';
    container.style.scrollBehavior = 'auto';
    
    container.scrollLeft = newScroll;
    
    // Force reflow
    void container.offsetWidth;
    
    // Re-enable (will be done by animation function or timeout)
    container.style.scrollSnapType = 'x mandatory';
    container.style.scrollBehavior = '';
    
    return targetIndex;
  }, [setLength, middleSetStart, middleSetEnd, getScrollPositionForSlide]);

  // Init
  const initScroll = useCallback(() => {
    if (!containerRef.current || isMobile || images.length === 0) return;
    const container = containerRef.current;
    
    // Hide initially
    // Calculated centered position
    const targetPos = getScrollPositionForSlide(middleSetStart);
    container.scrollLeft = targetPos;
    
    requestAnimationFrame(() => setIsReady(true));
  }, [images.length, isMobile, middleSetStart, getScrollPositionForSlide]);

  useEffect(() => {
    const timer = setTimeout(initScroll, 50);
    return () => clearTimeout(timer);
  }, [initScroll]);

  const handleScrollEnd = useCallback(() => {
    if (isAnimating.current) return;
    
    // Check if we effectively scrolled out of bounds using touchpad
    const currentIndex = getCenteredSlideIndex();
    if (currentIndex < setLength || currentIndex >= setLength * 4) {
      // Teleport back to middle if we drift too far (Sets 1 or 5)
      teleportToMiddleSet(currentIndex);
    }
  }, [getCenteredSlideIndex, setLength, teleportToMiddleSet]);

  // Debounced scroll handler for idle snap
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const handleScroll = useCallback(() => {
    if (isAnimating.current || !containerRef.current) return;
    
    // 1. Debounce for "Snap to center" logic when scroll stops
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(handleScrollEnd, 150);

    // 2. IMMEDIATE "Wall Avoidance" Check
    // If we are getting too close to the physical edge during a continuous scroll,
    // we must teleport immediately to avoid hitting the wall.
    // We are in a 5x buffer. Middle is Set 3.
    // If we enter Set 1 (too far left) or Set 5 (too far right), jump back to Set 3.
    
    const container = containerRef.current;
    
    // Efficient approximate index calculation to avoid heavy loop every frame
    // (Assuming equal widths roughly, but we can just use the center point)
    const center = container.scrollLeft + container.clientWidth / 2;
    const scrollWidth = container.scrollWidth;
    const approxProgress = center / scrollWidth; // 0 to 1
    
    // 5 Sets. Set 1 is 0.0-0.2. Set 2 is 0.2-0.4. Set 3 is 0.4-0.6. Set 4 is 0.6-0.8. Set 5 is 0.8-1.0.
    // If we are in Set 1 (< 0.2) or Set 5 (> 0.8), TELEPORT.
    const isTooFarLeft = approxProgress < 0.22; // In Set 1 or start of Set 2
    const isTooFarRight = approxProgress > 0.78; // In Set 5 or end of Set 4
    
    if (isTooFarLeft || isTooFarRight) {
       // We perform a more precise check and teleport
       const currentIndex = getCenteredSlideIndex();
       
       // Only teleport if we are actually OUTSIDE the safe middle zone (Set 3 and neighbors)
       // Let's be aggressive: Keep user in Sets 2, 3, 4.
       // logic: if index < 2L (Set 1 or 2) OR index >= 3L (Set 4 or 5)
       // Wait, we want to allow Set 2 and 4 to exist as buffers. 
       // Only reset if we hit Set 1 or Set 5.
       
       if (currentIndex < setLength || currentIndex >= setLength * 4) {
          teleportToMiddleSet(currentIndex);
       }
    }
  }, [handleScrollEnd, getCenteredSlideIndex, teleportToMiddleSet, setLength]);

  const navigate = useCallback((direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    
    // Temporarily disable scroll snap for the duration of the JS animation
    container.style.scrollSnapType = 'none';
    
    // Cancel existing animation if any
    if (animationRef.current) {
      animationRef.current();
      animationRef.current = null;
    }
    
    // ALWAYS get the current visual center - this is the ground truth
    // Even if we were animating, we now use where we ACTUALLY are, not where we intended to go
    let baseIndex = getCenteredSlideIndex();
    
    // If we have a pending destination AND we're close to it, use that instead
    // This handles the case of very rapid clicking where visual hasn't caught up
    if (isAnimating.current && destinationIndexRef.current !== null) {
      const destPos = getScrollPositionForSlide(destinationIndexRef.current);
      const currentPos = container.scrollLeft;
      const distToDestination = Math.abs(destPos - currentPos);
      
      // If we're more than 2/3 of the way to destination, use destination as base
      const slideWidth = container.children[0]?.clientWidth || 300;
      if (distToDestination < slideWidth * 0.33) {
        baseIndex = destinationIndexRef.current;
      }
    }
       
    // Boundary check for baseIndex
    if (baseIndex < setLength * 1 || baseIndex >= setLength * 4) {
       const currentVisual = getCenteredSlideIndex();
       const newVisual = teleportToMiddleSet(currentVisual);
       const diff = baseIndex - currentVisual;
       baseIndex = newVisual + diff;
    }
    
    let targetIndex = direction === 'right' ? baseIndex + 1 : baseIndex - 1;
    
    // Update ref
    destinationIndexRef.current = targetIndex;
    isAnimating.current = true;
    
    const targetPos = getScrollPositionForSlide(targetIndex);
    
    // Adaptive duration: longer for bigger distances, shorter for small ones
    const distance = Math.abs(targetPos - container.scrollLeft);
    const baseDuration = 350; // Minimum duration
    const maxDuration = 800;  // Maximum duration
    const adaptiveDuration = Math.min(Math.max(baseDuration, distance * 0.6), maxDuration);
    
    animationRef.current = smoothScrollTo(
      container,
      targetPos,
      adaptiveDuration,
      () => {
        isAnimating.current = false;
        animationRef.current = null;
        destinationIndexRef.current = null;
        
        // Re-enable snap
        container.style.scrollSnapType = 'x mandatory';
        
        // Post-animation boundary check
        const finalIndex = getCenteredSlideIndex();
        if (finalIndex < middleSetStart || finalIndex > middleSetEnd) {
           teleportToMiddleSet(finalIndex);
        }
      }
    );
    
  }, [getCenteredSlideIndex, getScrollPositionForSlide, middleSetStart, middleSetEnd, setLength, teleportToMiddleSet]);

  if (images.length === 0) {
    return null;
  }

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
