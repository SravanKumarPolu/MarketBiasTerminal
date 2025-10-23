'use client';

import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';

interface UpdateInfo {
  hasUpdate: boolean;
  isUpdating: boolean;
  lastChecked: Date | null;
}

export function useAutoUpdate() {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo>({
    hasUpdate: false,
    isUpdating: false,
    lastChecked: null,
  });

  const applyUpdate = useCallback(async () => {
    try {
      setUpdateInfo(prev => ({ ...prev, isUpdating: true }));
      
      // Get service worker registration
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration && registration.waiting) {
        // Tell the waiting service worker to skip waiting
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        
        // Listen for the controlling service worker to change
        registration.addEventListener('controllerchange', () => {
          // Reload the page to use the new service worker
          window.location.reload();
        });
      } else {
        // Force reload to get the latest version
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to apply update:', error);
      toast.error('Failed to apply update. Please refresh manually.');
      setUpdateInfo(prev => ({ ...prev, isUpdating: false }));
    }
  }, []);

  const checkForUpdates = useCallback(async () => {
    try {
      // Check if service worker is supported
      if (!('serviceWorker' in navigator)) {
        return;
      }

      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        return;
      }

      // Check for updates by comparing build timestamps
      const response = await fetch('/', {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (response.ok) {
        const lastModified = response.headers.get('last-modified');
        const lastUpdate = localStorage.getItem('lastUpdate');
        
        if (!lastUpdate || (lastModified && new Date(lastModified) > new Date(lastUpdate))) {
          setUpdateInfo(prev => ({
            ...prev,
            hasUpdate: true,
            lastChecked: new Date(),
          }));
          
          toast.info('New update available! Click to refresh.', {
            action: {
              label: 'Update',
              onClick: () => applyUpdate(),
            },
            duration: 10000,
          });
        } else {
          setUpdateInfo(prev => ({
            ...prev,
            hasUpdate: false,
            lastChecked: new Date(),
          }));
        }
      }
    } catch (error) {
      console.error('Failed to check for updates:', error);
    }
  }, [applyUpdate]);

  const forceUpdate = useCallback(() => {
    // Clear all caches and reload
    if ('caches' in window) {
      caches.keys().then((cacheNames) => {
        cacheNames.forEach((cacheName) => {
          caches.delete(cacheName);
        });
      });
    }
    
    // Clear localStorage cache
    localStorage.removeItem('lastUpdate');
    
    // Reload the page
    window.location.reload();
  }, []);

  useEffect(() => {
    // Check for updates on mount
    checkForUpdates();

    // Set up periodic update checks (every 5 minutes)
    const interval = setInterval(checkForUpdates, 5 * 60 * 1000);

    // Listen for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.hasUpdate) {
          setUpdateInfo(prev => ({
            ...prev,
            hasUpdate: true,
            lastChecked: new Date(),
          }));
          
          toast.info('New update available! Click to refresh.', {
            action: {
              label: 'Update',
              onClick: () => applyUpdate(),
            },
            duration: 10000,
          });
        }
      });
    }

    return () => {
      clearInterval(interval);
    };
  }, [checkForUpdates, applyUpdate]);

  return {
    ...updateInfo,
    checkForUpdates,
    applyUpdate,
    forceUpdate,
  };
}