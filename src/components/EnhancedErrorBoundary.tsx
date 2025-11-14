'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertCircle, 
  RefreshCw, 
  Download, 
  Copy, 
  Wifi,
  WifiOff,
  Clock,
  CheckCircle
} from 'lucide-react';
import { analytics } from '@/utils/analytics';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  errorId?: string;
  recoveryAttempts: number;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ 
    error?: Error; 
    errorInfo?: React.ErrorInfo;
    errorId?: string;
    resetError: () => void;
    recoveryActions: Array<{ id: string; name: string; description: string; priority: string }>;
    executeRecovery: (actionId: string) => Promise<boolean>;
  }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  enableRecovery?: boolean;
  enableReporting?: boolean;
}

export class EnhancedErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeout: NodeJS.Timeout | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false, 
      recoveryAttempts: 0 
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { 
      hasError: true, 
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('EnhancedErrorBoundary caught an error:', error, errorInfo);
    
    // Record error for recovery
    if (this.props.enableRecovery !== false) {
      // Import the errorRecovery directly instead of using the hook
      import('@/utils/errorRecovery').then(({ errorRecovery }) => {
        errorRecovery.recordError(error, {
          component: 'ErrorBoundary',
          action: 'componentDidCatch',
          stack: error.stack
        });
      });
    }

    // Track error in analytics
    analytics.trackError(error.message, 'ErrorBoundary', {
      component: errorInfo.componentStack?.split('\n')[0] || 'unknown',
      errorId: this.state.errorId || 'unknown'
    });

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    this.setState({ errorInfo });
  }

  resetError = () => {
    this.setState({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined,
      errorId: undefined,
      recoveryAttempts: 0
    });
  };

  handleRecovery = async (actionId: string): Promise<boolean> => {
    try {
      const { errorRecovery } = await import('@/utils/errorRecovery');
      const success = await errorRecovery.executeRecoveryAction(actionId);
      if (success) {
        this.resetError();
        analytics.trackEvent('error_recovery_success', {
          actionId,
          errorId: this.state.errorId || 'unknown'
        });
        return true;
      } else {
        this.setState(prev => ({ recoveryAttempts: prev.recoveryAttempts + 1 }));
        analytics.trackEvent('error_recovery_failed', {
          actionId,
          errorId: this.state.errorId || 'unknown',
          attempts: this.state.recoveryAttempts + 1
        });
        return false;
      }
    } catch (error) {
      console.error('Recovery action failed:', error);
      return false;
    }
  };

  generateErrorReport = async () => {
    const { error, errorInfo, errorId } = this.state;
    const { offlineSupport } = await import('@/utils/offlineSupport');
    const getSyncStatus = offlineSupport.getSyncQueueStatus;
    const getOfflineDataSummary = offlineSupport.getOfflineDataSummary;
    
    const report = {
      errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      error: {
        name: error?.name,
        message: error?.message,
        stack: error?.stack
      },
      errorInfo: {
        componentStack: errorInfo?.componentStack
      },
      systemInfo: {
        online: navigator.onLine,
        syncStatus: getSyncStatus(),
        offlineData: getOfflineDataSummary(),
        memoryUsage: (performance as Performance & { memory?: { usedJSHeapSize: number; totalJSHeapSize: number } }).memory ? {
          used: (performance as Performance & { memory?: { usedJSHeapSize: number; totalJSHeapSize: number } }).memory!.usedJSHeapSize,
          total: (performance as Performance & { memory?: { usedJSHeapSize: number; totalJSHeapSize: number } }).memory!.totalJSHeapSize
        } : null
      }
    };

    return JSON.stringify(report, null, 2);
  };

  copyErrorReport = async () => {
    const report = await this.generateErrorReport();
    navigator.clipboard.writeText(report).then(() => {
      analytics.trackEvent('error_report_copied', {
        errorId: this.state.errorId || 'unknown'
      });
    });
  };

  downloadErrorReport = async () => {
    const report = await this.generateErrorReport();
    const blob = new Blob([report], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-report-${this.state.errorId || 'unknown'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        
        return (
          <FallbackComponent
            error={this.state.error}
            errorInfo={this.state.errorInfo}
            errorId={this.state.errorId}
            resetError={this.resetError}
            recoveryActions={[]}
            executeRecovery={this.handleRecovery}
          />
        );
      }

      return (
        <DefaultErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          errorId={this.state.errorId}
          resetError={this.resetError}
          recoveryActions={[]}
          executeRecovery={this.handleRecovery}
        />
      );
    }

    return this.props.children;
  }
}

// Enhanced default fallback component
export function DefaultErrorFallback({ 
  error, 
  errorInfo, 
  errorId,
  resetError, 
  recoveryActions,
  executeRecovery 
}: { 
  error?: Error; 
  errorInfo?: React.ErrorInfo;
  errorId?: string;
  resetError: () => void; 
  recoveryActions: Array<{ id: string; name: string; description: string; priority: string }>;
  executeRecovery: (actionId: string) => Promise<boolean>;
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isRecovering, setIsRecovering] = useState(false);
  const [syncStatus, setSyncStatus] = useState({ pendingItems: 0, failedItems: 0, syncInProgress: false });
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const updateSyncStatus = async () => {
      const { offlineSupport } = await import('@/utils/offlineSupport');
      setSyncStatus(offlineSupport.getSyncQueueStatus());
    };
    
    updateSyncStatus();
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRecovery = async (actionId: string) => {
    setIsRecovering(true);
    try {
      await executeRecovery(actionId);
    } finally {
      setIsRecovering(false);
    }
  };

  const copyErrorReport = async () => {
    const report = await generateErrorReport();
    navigator.clipboard.writeText(report).then(() => {
      analytics.trackEvent('error_report_copied', {
        errorId: errorId || 'unknown'
      });
    });
  };

  const downloadErrorReport = async () => {
    const report = await generateErrorReport();
    const blob = new Blob([report], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-report-${errorId || 'unknown'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateErrorReport = async () => {
    const { offlineSupport } = await import('@/utils/offlineSupport');
    const getSyncStatus = offlineSupport.getSyncQueueStatus;
    const getOfflineDataSummary = offlineSupport.getOfflineDataSummary;
    
    const report = {
      errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      error: {
        name: error?.name,
        message: error?.message,
        stack: error?.stack
      },
      errorInfo: {
        componentStack: errorInfo?.componentStack
      },
      systemInfo: {
        online: navigator.onLine,
        syncStatus: getSyncStatus(),
        offlineData: getOfflineDataSummary(),
        memoryUsage: (performance as Performance & { memory?: { usedJSHeapSize: number; totalJSHeapSize: number } }).memory ? {
          used: (performance as Performance & { memory?: { usedJSHeapSize: number; totalJSHeapSize: number } }).memory!.usedJSHeapSize,
          total: (performance as Performance & { memory?: { usedJSHeapSize: number; totalJSHeapSize: number } }).memory!.totalJSHeapSize
        } : null
      }
    };

    return JSON.stringify(report, null, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-6 w-6" />
            Application Error
            {errorId && (
              <Badge variant="outline" className="ml-2">
                {errorId}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="recovery">Recovery</TabsTrigger>
              <TabsTrigger value="report">Report</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="text-center space-y-4">
                <div className="text-6xl">⚠️</div>
                <h3 className="text-xl font-semibold">Something went wrong</h3>
                <p className="text-gray-600">
                  The application encountered an unexpected error. Don&apos;t worry, we can help you recover.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  {isOnline ? (
                    <Wifi className="h-5 w-5 text-green-600" />
                  ) : (
                    <WifiOff className="h-5 w-5 text-red-600" />
                  )}
                  <span className="text-sm">
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>

                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="text-sm">
                    {new Date().toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 justify-center">
                <Button onClick={resetError} variant="default">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Reload Page
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              {error && (
                <div>
                  <h4 className="font-semibold mb-2">Error Details</h4>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-sm font-medium">{error.name}</p>
                    <p className="text-sm text-gray-600 mt-1">{error.message}</p>
                  </div>
                </div>
              )}

              {errorInfo && (
                <div>
                  <h4 className="font-semibold mb-2">Component Stack</h4>
                  <div className="bg-gray-100 p-3 rounded-lg max-h-40 overflow-auto">
                    <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                      {errorInfo.componentStack}
                    </pre>
                  </div>
                </div>
              )}

              {error?.stack && (
                <div>
                  <h4 className="font-semibold mb-2">Stack Trace</h4>
                  <div className="bg-gray-100 p-3 rounded-lg max-h-40 overflow-auto">
                    <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                      {error.stack}
                    </pre>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="recovery" className="space-y-4">
              <div>
                <h4 className="font-semibold mb-4">Recovery Options</h4>
                <div className="space-y-3">
                  {recoveryActions.map((action) => (
                    <div key={action.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h5 className="font-medium">{action.name}</h5>
                        <p className="text-sm text-gray-600">{action.description}</p>
                        <Badge 
                          variant={action.priority === 'critical' ? 'destructive' : 'secondary'}
                          className="mt-1"
                        >
                          {action.priority}
                        </Badge>
                      </div>
                      <Button
                        onClick={() => handleRecovery(action.id)}
                        disabled={isRecovering}
                        variant={action.priority === 'critical' ? 'destructive' : 'outline'}
                        size="sm"
                      >
                        {isRecovering ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          'Try'
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h5 className="font-medium text-blue-900 mb-2">Sync Status</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    {syncStatus.syncInProgress ? (
                      <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                    <span>Sync Status: {syncStatus.syncInProgress ? 'In Progress' : 'Idle'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Pending Items: {syncStatus.pendingItems}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Failed Items: {syncStatus.failedItems}</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="report" className="space-y-4">
              <div>
                <h4 className="font-semibold mb-4">Error Report</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Generate a detailed error report to help us improve the application.
                </p>
                
                <div className="flex gap-2">
                  <Button onClick={copyErrorReport} variant="outline" size="sm">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Report
                  </Button>
                  <Button onClick={downloadErrorReport} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg">
                <h5 className="font-medium text-yellow-900 mb-2">Privacy Notice</h5>
                <p className="text-sm text-yellow-900">
                  The error report contains technical information about the error and your system state. 
                  No personal data is included. This helps us diagnose and fix issues.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

// Hook version for functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: React.ErrorInfo) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo);
    // Import errorRecovery directly
    import('@/utils/errorRecovery').then(({ errorRecovery }) => {
      errorRecovery.recordError(error, {
        component: 'useErrorHandler',
        action: 'manual_error_handling',
        stack: error.stack
      });
    });
  };
}
