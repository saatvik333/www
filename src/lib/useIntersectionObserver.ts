'use client';

import { useEffect, useRef, useState, RefObject } from 'react';

// Shared IntersectionObserver for all PhotoItem instances
// Much more efficient than creating one observer per item
let sharedObserver: IntersectionObserver | null = null;
const observerCallbacks = new Map<Element, (isVisible: boolean) => void>();

function getSharedObserver(): IntersectionObserver {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const callback = observerCallbacks.get(entry.target);
          if (callback && entry.isIntersecting) {
            callback(true);
            // Once visible, we can stop observing this element
            sharedObserver?.unobserve(entry.target);
            observerCallbacks.delete(entry.target);
          }
        });
      },
      {
        rootMargin: '300px', // Load images 300px before they enter viewport
        threshold: 0,
      }
    );
  }
  return sharedObserver;
}

/**
 * Hook that uses a shared IntersectionObserver for efficient visibility detection.
 * Returns true once the element becomes visible (one-time trigger).
 */
export function useIntersectionObserver(
  ref: RefObject<Element | null>
): boolean {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || isVisible) return;

    const observer = getSharedObserver();
    
    observerCallbacks.set(element, (visible) => {
      if (visible) setIsVisible(true);
    });
    
    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observerCallbacks.delete(element);
    };
  }, [ref, isVisible]);

  return isVisible;
}
