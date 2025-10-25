'use client';

import { useCallback } from 'react';

interface HapticFeedbackOptions {
  intensity?: 'light' | 'medium' | 'heavy';
  duration?: number;
}

export function useHapticFeedback() {
  const triggerHaptic = useCallback((options: HapticFeedbackOptions = {}) => {
    const { intensity = 'medium', duration = 10 } = options;

    // Check if the device supports haptic feedback
    if (typeof window === 'undefined' || !('vibrate' in navigator)) {
      return false;
    }

    try {
      // Different vibration patterns for different intensities
      const patterns = {
        light: [duration],
        medium: [duration, 5, duration],
        heavy: [duration, 10, duration, 5, duration]
      };

      const pattern = patterns[intensity];
      navigator.vibrate(pattern);
      return true;
    } catch (error) {
      console.warn('Haptic feedback not supported:', error);
      return false;
    }
  }, []);

  const lightHaptic = useCallback(() => {
    return triggerHaptic({ intensity: 'light' });
  }, [triggerHaptic]);

  const mediumHaptic = useCallback(() => {
    return triggerHaptic({ intensity: 'medium' });
  }, [triggerHaptic]);

  const heavyHaptic = useCallback(() => {
    return triggerHaptic({ intensity: 'heavy' });
  }, [triggerHaptic]);

  const successHaptic = useCallback(() => {
    // Success pattern: light-medium-light
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([10, 5, 20, 5, 10]);
      return true;
    }
    return false;
  }, []);

  const errorHaptic = useCallback(() => {
    // Error pattern: heavy-heavy
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([50, 10, 50]);
      return true;
    }
    return false;
  }, []);

  const warningHaptic = useCallback(() => {
    // Warning pattern: medium-medium
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([30, 5, 30]);
      return true;
    }
    return false;
  }, []);

  return {
    triggerHaptic,
    lightHaptic,
    mediumHaptic,
    heavyHaptic,
    successHaptic,
    errorHaptic,
    warningHaptic
  };
}
