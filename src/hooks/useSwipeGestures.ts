'use client';

import { useEffect, useRef, useCallback } from 'react';

interface SwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  preventDefault?: boolean;
}

interface TouchPosition {
  x: number;
  y: number;
  timestamp: number;
}

export function useSwipeGestures(options: SwipeGestureOptions = {}) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    preventDefault = true
  } = options;

  const touchStart = useRef<TouchPosition | null>(null);
  const touchEnd = useRef<TouchPosition | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (preventDefault) {
      e.preventDefault();
    }
    
    const touch = e.touches[0];
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    };
    touchEnd.current = null;
  }, [preventDefault]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (preventDefault) {
      e.preventDefault();
    }
    
    const touch = e.touches[0];
    touchEnd.current = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    };
  }, [preventDefault]);

  const handleTouchEnd = useCallback(() => {

    if (!touchStart.current || !touchEnd.current) return;

    const deltaX = touchEnd.current.x - touchStart.current.x;
    const deltaY = touchEnd.current.y - touchStart.current.y;
    const deltaTime = touchEnd.current.timestamp - touchStart.current.timestamp;

    // Only process swipes that are quick enough (less than 300ms)
    if (deltaTime > 300) return;

    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Determine if it's a horizontal or vertical swipe
    if (absDeltaX > absDeltaY) {
      // Horizontal swipe
      if (absDeltaX > threshold) {
        if (deltaX > 0) {
          onSwipeRight?.();
        } else {
          onSwipeLeft?.();
        }
      }
    } else {
      // Vertical swipe
      if (absDeltaY > threshold) {
        if (deltaY > 0) {
          onSwipeDown?.();
        } else {
          onSwipeUp?.();
        }
      }
    }

    touchStart.current = null;
    touchEnd.current = null;
  }, [threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  useEffect(() => {
    const element = document.body;
    
    element.addEventListener('touchstart', handleTouchStart, { passive: !preventDefault });
    element.addEventListener('touchmove', handleTouchMove, { passive: !preventDefault });
    element.addEventListener('touchend', handleTouchEnd, { passive: !preventDefault });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, preventDefault]);

  return {
    // Expose methods for manual gesture handling if needed
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
}

// Hook for pull-to-refresh functionality
export function usePullToRefresh(onRefresh: () => void, threshold = 80) {
  const pullDistance = useRef(0);
  const isPulling = useRef(false);
  const startY = useRef(0);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    // Only trigger pull-to-refresh when at the top of the page
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
      isPulling.current = true;
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isPulling.current) return;

    const currentY = e.touches[0].clientY;
    const distance = currentY - startY.current;

    if (distance > 0) {
      pullDistance.current = Math.min(distance, threshold * 1.5);
      
      // Add visual feedback
      const pullIndicator = document.getElementById('pull-to-refresh-indicator');
      if (pullIndicator) {
        const opacity = Math.min(pullDistance.current / threshold, 1);
        pullIndicator.style.opacity = opacity.toString();
        pullIndicator.style.transform = `translateY(${pullDistance.current * 0.5}px)`;
      }
    }
  }, [threshold]);

  const handleTouchEnd = useCallback(() => {
    if (!isPulling.current) return;

    if (pullDistance.current >= threshold) {
      onRefresh();
    }

    // Reset pull state
    isPulling.current = false;
    pullDistance.current = 0;

    // Reset visual feedback
    const pullIndicator = document.getElementById('pull-to-refresh-indicator');
    if (pullIndicator) {
      pullIndicator.style.opacity = '0';
      pullIndicator.style.transform = 'translateY(0)';
    }
  }, [threshold, onRefresh]);

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    pullDistance: pullDistance.current,
    isPulling: isPulling.current
  };
}
