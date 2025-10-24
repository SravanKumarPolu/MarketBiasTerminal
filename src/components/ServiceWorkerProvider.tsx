'use client';

import { useEffect } from 'react';
import { registerServiceWorker } from '@/utils/registerSW';

export function ServiceWorkerProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Register service worker for auto-updates
    registerServiceWorker();
  }, []);

  return <>{children}</>;
}
