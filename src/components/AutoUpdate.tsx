'use client';

import { useEffect } from 'react';
import { useAutoUpdate } from '@/hooks/useAutoUpdate';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface AutoUpdateProps {
  showButton?: boolean;
  autoCheck?: boolean;
  checkInterval?: number; // in minutes
}

export function AutoUpdate({ 
  showButton = true, 
  autoCheck = true,
  checkInterval = 5 
}: AutoUpdateProps) {
  const { hasUpdate, isUpdating, lastChecked, checkForUpdates, applyUpdate, forceUpdate } = useAutoUpdate();

  useEffect(() => {
    if (autoCheck) {
      // Initial check
      checkForUpdates();
      
      // Set up periodic checks
      const interval = setInterval(checkForUpdates, checkInterval * 60 * 1000);
      
      return () => clearInterval(interval);
    }
  }, [autoCheck, checkInterval, checkForUpdates]);

  const handleUpdate = async () => {
    try {
      await applyUpdate();
      toast.success('Update applied successfully!');
    } catch (error) {
      toast.error('Failed to apply update. Please refresh manually.');
    }
  };

  const handleForceUpdate = () => {
    toast.info('Forcing update...');
    forceUpdate();
  };

  if (!showButton) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {hasUpdate && (
        <Button
          onClick={handleUpdate}
          disabled={isUpdating}
          size="sm"
          variant="default"
          className="bg-green-600 hover:bg-green-700"
        >
          {isUpdating ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Update Available
            </>
          )}
        </Button>
      )}
      
      {!hasUpdate && lastChecked && (
        <Button
          onClick={handleForceUpdate}
          size="sm"
          variant="outline"
          className="text-gray-600"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Check for Updates
        </Button>
      )}
      
      {!lastChecked && (
        <Button
          onClick={checkForUpdates}
          size="sm"
          variant="outline"
          className="text-gray-600"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Check Updates
        </Button>
      )}
    </div>
  );
}
