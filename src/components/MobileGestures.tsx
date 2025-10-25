'use client';

import { useEffect, useState } from 'react';
import { useSwipeGestures, usePullToRefresh } from '@/hooks/useSwipeGestures';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { useMarketStore } from '@/store/marketStore';
import { RefreshCw, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

interface MobileGesturesProps {
  children: React.ReactNode;
  enableNavigation?: boolean;
  enableRefresh?: boolean;
  enableHaptic?: boolean;
}

export function MobileGestures({ 
  children, 
  enableNavigation = true, 
  enableHaptic = true 
}: MobileGesturesProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { refreshData } = useMarketStore();
  const { lightHaptic, mediumHaptic, successHaptic, errorHaptic } = useHapticFeedback();

  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    if (enableHaptic) mediumHaptic();
    
    try {
      await refreshData();
      if (enableHaptic) successHaptic();
      toast.success('Data refreshed successfully');
    } catch {
      if (enableHaptic) errorHaptic();
      toast.error('Failed to refresh data');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSwipeLeft = () => {
    if (enableNavigation) {
      if (enableHaptic) lightHaptic();
      // Navigate to next page/section
      toast.info('Swipe left detected');
    }
  };

  const handleSwipeRight = () => {
    if (enableNavigation) {
      if (enableHaptic) lightHaptic();
      // Navigate to previous page/section
      toast.info('Swipe right detected');
    }
  };

  const handleSwipeUp = () => {
    if (enableHaptic) lightHaptic();
    // Scroll to top or show more content
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSwipeDown = () => {
    if (enableHaptic) lightHaptic();
    // Scroll to bottom or show more content
    window.scrollTo({ 
      top: document.body.scrollHeight, 
      behavior: 'smooth' 
    });
  };

  // Configure swipe gestures
  useSwipeGestures({
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
    onSwipeUp: handleSwipeUp,
    onSwipeDown: handleSwipeDown,
    threshold: 50,
    preventDefault: false
  });

  // Configure pull-to-refresh
  usePullToRefresh(handleRefresh, 80);

  // Add pull-to-refresh indicator
  useEffect(() => {
    const indicator = document.createElement('div');
    indicator.id = 'pull-to-refresh-indicator';
    indicator.className = 'fixed top-0 left-1/2 transform -translate-x-1/2 -translate-y-full z-50 bg-blue-600 text-white px-4 py-2 rounded-b-lg shadow-lg transition-all duration-200 opacity-0';
    indicator.innerHTML = `
      <div class="flex items-center gap-2">
        <RefreshCw class="h-4 w-4 animate-spin" />
        <span class="text-sm font-medium">Pull to refresh</span>
      </div>
    `;
    document.body.appendChild(indicator);

    return () => {
      const existingIndicator = document.getElementById('pull-to-refresh-indicator');
      if (existingIndicator) {
        existingIndicator.remove();
      }
    };
  }, []);

  return (
    <>
      {children}
      
      {/* Mobile gesture hints */}
      <div className="fixed bottom-4 right-4 z-40 md:hidden">
        <div className="bg-black/80 text-white p-2 rounded-lg text-xs space-y-1">
          <div className="flex items-center gap-1">
            <ChevronLeft className="h-3 w-3" />
            <span>Swipe</span>
            <ChevronRight className="h-3 w-3" />
          </div>
          <div className="flex items-center gap-1">
            <ChevronUp className="h-3 w-3" />
            <span>Pull down to refresh</span>
            <ChevronDown className="h-3 w-3" />
          </div>
        </div>
      </div>

      {/* Refresh indicator */}
      {isRefreshing && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span className="text-sm font-medium">Refreshing...</span>
          </div>
        </div>
      )}
    </>
  );
}
