'use client';

import { useRef, useCallback } from 'react';

interface UseSwipeNavigationProps {
  onSwipeLeft: () => void;   // Continue / go forward
  onSwipeRight: () => void;  // Go back
  threshold?: number;         // Min swipe distance in px (default: 50)
}

interface UseSwipeNavigationReturn {
  handlers: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
  };
}

export function useSwipeNavigation({
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
}: UseSwipeNavigationProps): UseSwipeNavigationReturn {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const lastSwipeTimeRef = useRef<number>(0);
  const DEBOUNCE_MS = 300;

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const now = Date.now();
    if (now - lastSwipeTimeRef.current < DEBOUNCE_MS) return;

    const touch = e.changedTouches[0];
    if (!touch) return;

    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;

    // Reset
    touchStartRef.current = null;

    // Only trigger if horizontal distance > threshold AND horizontal > vertical
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (absDeltaX > threshold && absDeltaX > absDeltaY) {
      lastSwipeTimeRef.current = now;

      if (deltaX > threshold) {
        // Swiped right → go back
        onSwipeRight();
      } else if (deltaX < -threshold) {
        // Swiped left → continue
        onSwipeLeft();
      }
    }
  }, [onSwipeLeft, onSwipeRight, threshold]);

  return {
    handlers: {
      onTouchStart,
      onTouchEnd,
    },
  };
}

export default useSwipeNavigation;
