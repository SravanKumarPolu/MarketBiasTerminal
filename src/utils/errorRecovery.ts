'use client';

import { analytics } from './analytics';

export interface ErrorContext {
  component: string;
  action: string;
  timestamp: number;
  userAgent: string;
  url: string;
  stack?: string;
}

export interface RecoveryAction {
  id: string;
  name: string;
  description: string;
  action: () => Promise<boolean>;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

class ErrorRecoveryManager {
  private errorHistory: ErrorContext[] = [];
  private recoveryActions: RecoveryAction[] = [];
  private isOnline: boolean = true;

  constructor() {
    this.setupNetworkMonitoring();
    this.registerDefaultRecoveryActions();
  }

  private setupNetworkMonitoring() {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', () => {
      this.isOnline = true;
      this.handleNetworkRecovery();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.handleNetworkLoss();
    });
  }

  private registerDefaultRecoveryActions() {
    this.recoveryActions = [
      {
        id: 'retry-request',
        name: 'Retry Request',
        description: 'Attempt to retry the failed request',
        action: async () => {
          // This would be implemented by the calling component
          return false;
        },
        priority: 'high'
      },
      {
        id: 'clear-cache',
        name: 'Clear Cache',
        description: 'Clear application cache and reload data',
        action: async () => {
          try {
            if ('caches' in window) {
              const cacheNames = await caches.keys();
              await Promise.all(
                cacheNames.map(cacheName => caches.delete(cacheName))
              );
            }
            return true;
          } catch (error) {
            console.error('Failed to clear cache:', error);
            return false;
          }
        },
        priority: 'medium'
      },
      {
        id: 'reload-page',
        name: 'Reload Page',
        description: 'Reload the current page',
        action: async () => {
          try {
            window.location.reload();
            return true;
          } catch (error) {
            console.error('Failed to reload page:', error);
            return false;
          }
        },
        priority: 'critical'
      },
      {
        id: 'fallback-data',
        name: 'Use Fallback Data',
        description: 'Switch to cached or mock data',
        action: async () => {
          try {
            // This would trigger fallback data loading
            return true;
          } catch (error) {
            console.error('Failed to load fallback data:', error);
            return false;
          }
        },
        priority: 'high'
      },
      {
        id: 'reset-state',
        name: 'Reset Application State',
        description: 'Reset application state to initial values',
        action: async () => {
          try {
            // Clear localStorage/sessionStorage
            localStorage.removeItem('market-store');
            sessionStorage.clear();
            return true;
          } catch (error) {
            console.error('Failed to reset state:', error);
            return false;
          }
        },
        priority: 'medium'
      }
    ];
  }

  recordError(error: Error, context: Partial<ErrorContext> = {}) {
    const errorContext: ErrorContext = {
      component: context.component || 'unknown',
      action: context.action || 'unknown',
      timestamp: Date.now(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location.href : 'server',
      stack: error.stack,
      ...context
    };

    this.errorHistory.push(errorContext);

    // Track error in analytics
    analytics.trackError(error.message, errorContext.component, {
      action: errorContext.action,
      stack: errorContext.stack?.substring(0, 500) || 'No stack trace available' // Limit stack trace length
    });

    // Auto-trigger recovery for certain error types
    this.autoRecover(error);
  }

  private async autoRecover(error: Error) {
    const errorMessage = error.message.toLowerCase();

    // Network errors
    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      if (!this.isOnline) {
        this.showOfflineMessage();
        return;
      }
      await this.executeRecoveryAction('retry-request');
      return;
    }

    // Cache errors
    if (errorMessage.includes('cache') || errorMessage.includes('storage')) {
      await this.executeRecoveryAction('clear-cache');
      return;
    }

    // State errors
    if (errorMessage.includes('state') || errorMessage.includes('store')) {
      await this.executeRecoveryAction('reset-state');
      return;
    }

    // Data errors
    if (errorMessage.includes('data') || errorMessage.includes('parse')) {
      await this.executeRecoveryAction('fallback-data');
      return;
    }
  }

  async executeRecoveryAction(actionId: string): Promise<boolean> {
    const action = this.recoveryActions.find(a => a.id === actionId);
    if (!action) {
      console.warn(`Recovery action ${actionId} not found`);
      return false;
    }

    try {
      console.log(`Executing recovery action: ${action.name}`);
      const success = await action.action();
      
      if (success) {
        console.log(`Recovery action ${action.name} completed successfully`);
        this.showRecoveryMessage(action.name, true);
      } else {
        console.warn(`Recovery action ${action.name} failed`);
        this.showRecoveryMessage(action.name, false);
      }

      return success;
    } catch (error) {
      console.error(`Recovery action ${action.name} threw an error:`, error);
      this.showRecoveryMessage(action.name, false);
      return false;
    }
  }

  getSuggestedRecoveryActions(context: ErrorContext): RecoveryAction[] {
    const suggestions: RecoveryAction[] = [];

    // Suggest actions based on error context
    if (context.component.includes('data') || context.action.includes('fetch')) {
      suggestions.push(
        this.recoveryActions.find(a => a.id === 'retry-request')!,
        this.recoveryActions.find(a => a.id === 'fallback-data')!
      );
    }

    if (context.component.includes('cache') || context.action.includes('storage')) {
      suggestions.push(
        this.recoveryActions.find(a => a.id === 'clear-cache')!
      );
    }

    if (context.component.includes('state') || context.action.includes('store')) {
      suggestions.push(
        this.recoveryActions.find(a => a.id === 'reset-state')!
      );
    }

    // Always include reload as last resort
    suggestions.push(
      this.recoveryActions.find(a => a.id === 'reload-page')!
    );

    return suggestions.filter(Boolean);
  }

  private handleNetworkRecovery() {
    console.log('Network connection restored');
    this.showRecoveryMessage('Network connection restored', true);
    
    // Attempt to retry any pending operations
    this.retryPendingOperations();
  }

  private handleNetworkLoss() {
    console.log('Network connection lost');
    this.showOfflineMessage();
  }

  private async retryPendingOperations() {
    // This would retry any operations that failed due to network issues
    // Implementation depends on your specific use case
  }

  private showRecoveryMessage(action: string, success: boolean) {
    if (typeof window === 'undefined') return;

    // Create a toast notification
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
      success ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`;
    notification.textContent = success 
      ? `✅ ${action} completed successfully`
      : `❌ ${action} failed`;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 5000);
  }

  private showOfflineMessage() {
    if (typeof window === 'undefined') return;

    const existingMessage = document.getElementById('offline-message');
    if (existingMessage) return;

    const message = document.createElement('div');
    message.id = 'offline-message';
    message.className = 'fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-black text-center py-2 px-4';
    message.innerHTML = `
      <div class="flex items-center justify-center gap-2">
        <span>📡</span>
        <span>You're offline. Some features may not work properly.</span>
      </div>
    `;

    document.body.appendChild(message);
  }

  getErrorHistory(): ErrorContext[] {
    return [...this.errorHistory];
  }

  clearErrorHistory() {
    this.errorHistory = [];
  }

  getRecoveryActions(): RecoveryAction[] {
    return [...this.recoveryActions];
  }

  addRecoveryAction(action: RecoveryAction) {
    this.recoveryActions.push(action);
  }

  removeRecoveryAction(actionId: string) {
    this.recoveryActions = this.recoveryActions.filter(a => a.id !== actionId);
  }
}

// Export singleton instance
export const errorRecovery = new ErrorRecoveryManager();

// React hook for error recovery
export function useErrorRecovery() {
  const recordError = (error: Error, context?: Partial<ErrorContext>) => {
    errorRecovery.recordError(error, context);
  };

  const executeRecovery = async (actionId: string) => {
    return await errorRecovery.executeRecoveryAction(actionId);
  };

  const getSuggestedActions = (context: ErrorContext) => {
    return errorRecovery.getSuggestedRecoveryActions(context);
  };

  return {
    recordError,
    executeRecovery,
    getSuggestedActions,
    errorHistory: errorRecovery.getErrorHistory(),
    recoveryActions: errorRecovery.getRecoveryActions()
  };
}
