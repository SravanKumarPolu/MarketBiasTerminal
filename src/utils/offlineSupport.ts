'use client';

import { analytics } from './analytics';

export interface OfflineData {
  timestamp: number;
  data: Record<string, unknown>;
  version: string;
  ttl: number; // Time to live in milliseconds
}

export interface SyncQueueItem {
  id: string;
  action: 'create' | 'update' | 'delete';
  data: Record<string, unknown>;
  timestamp: number;
  retries: number;
  maxRetries: number;
}

class OfflineSupportManager {
  private isOnline: boolean = true;
  private syncQueue: SyncQueueItem[] = [];
  private offlineData: Map<string, OfflineData> = new Map();
  private syncInProgress: boolean = false;
  private syncInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.setupNetworkMonitoring();
    this.setupSyncQueue();
    this.loadOfflineData();
  }

  private setupNetworkMonitoring() {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', () => {
      this.isOnline = true;
      this.handleOnline();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.handleOffline();
    });

    // Check initial online status
    this.isOnline = navigator.onLine;
  }

  private setupSyncQueue() {
    // Load sync queue from localStorage
    const savedQueue = localStorage.getItem('sync-queue');
    if (savedQueue) {
      try {
        this.syncQueue = JSON.parse(savedQueue);
      } catch (error) {
        console.error('Failed to load sync queue:', error);
        this.syncQueue = [];
      }
    }

    // Start periodic sync
    this.startPeriodicSync();
  }

  private startPeriodicSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(() => {
      if (this.isOnline && this.syncQueue.length > 0) {
        this.syncPendingChanges();
      }
    }, 30000); // Sync every 30 seconds
  }

  private async handleOnline() {
    console.log('Network connection restored');
    analytics.trackEvent('network_restored', {
      timestamp: Date.now(),
      pendingSyncItems: this.syncQueue.length
    });

    // Show online indicator
    this.showOnlineIndicator();

    // Start syncing pending changes
    if (this.syncQueue.length > 0) {
      await this.syncPendingChanges();
    }
  }

  private handleOffline() {
    console.log('Network connection lost');
    analytics.trackEvent('network_lost', {
      timestamp: Date.now(),
      pendingSyncItems: this.syncQueue.length
    });

    // Show offline indicator
    this.showOfflineIndicator();
  }

  private showOnlineIndicator() {
    if (typeof window === 'undefined') return;

    const existingIndicator = document.getElementById('online-indicator');
    if (existingIndicator) {
      existingIndicator.remove();
    }

    const indicator = document.createElement('div');
    indicator.id = 'online-indicator';
    indicator.className = 'fixed top-0 left-0 right-0 z-50 bg-green-500 text-white text-center py-2 px-4';
    indicator.innerHTML = `
      <div class="flex items-center justify-center gap-2">
        <span>🟢</span>
        <span>You're back online. Syncing changes...</span>
      </div>
    `;

    document.body.appendChild(indicator);

    setTimeout(() => {
      indicator.remove();
    }, 3000);
  }

  private showOfflineIndicator() {
    if (typeof window === 'undefined') return;

    const existingIndicator = document.getElementById('offline-indicator');
    if (existingIndicator) return;

    const indicator = document.createElement('div');
    indicator.id = 'offline-indicator';
    indicator.className = 'fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-black text-center py-2 px-4';
    indicator.innerHTML = `
      <div class="flex items-center justify-center gap-2">
        <span>🟡</span>
        <span>You're offline. Changes will sync when connection is restored.</span>
      </div>
    `;

    document.body.appendChild(indicator);
  }

  // Cache data for offline use
  cacheData(key: string, data: Record<string, unknown>, ttl: number = 24 * 60 * 60 * 1000) { // Default 24 hours
    const offlineData: OfflineData = {
      timestamp: Date.now(),
      data,
      version: '1.0.0',
      ttl
    };

    this.offlineData.set(key, offlineData);
    this.saveOfflineData();

    analytics.trackEvent('data_cached', {
      key,
      size: JSON.stringify(data).length,
      ttl
    });
  }

  // Get cached data
  getCachedData(key: string): Record<string, unknown> | null {
    const offlineData = this.offlineData.get(key);
    if (!offlineData) return null;

    // Check if data is still valid
    const now = Date.now();
    if (now - offlineData.timestamp > offlineData.ttl) {
      this.offlineData.delete(key);
      this.saveOfflineData();
      return null;
    }

    return offlineData.data;
  }

  // Check if data is available offline
  isDataAvailableOffline(key: string): boolean {
    const offlineData = this.offlineData.get(key);
    if (!offlineData) return false;

    const now = Date.now();
    return now - offlineData.timestamp <= offlineData.ttl;
  }

  // Add item to sync queue
  addToSyncQueue(action: SyncQueueItem['action'], data: Record<string, unknown>, id?: string) {
    const syncItem: SyncQueueItem = {
      id: id || `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      action,
      data,
      timestamp: Date.now(),
      retries: 0,
      maxRetries: 3
    };

    this.syncQueue.push(syncItem);
    this.saveSyncQueue();

    analytics.trackEvent('sync_item_added', {
      action,
      id: syncItem.id,
      queueLength: this.syncQueue.length
    });

    // Try to sync immediately if online
    if (this.isOnline) {
      this.syncPendingChanges();
    }
  }

  // Sync pending changes
  private async syncPendingChanges() {
    if (this.syncInProgress || this.syncQueue.length === 0) return;

    this.syncInProgress = true;
    console.log(`Syncing ${this.syncQueue.length} pending changes...`);

    const itemsToSync = [...this.syncQueue];
    const successfulSyncs: string[] = [];
    const failedSyncs: SyncQueueItem[] = [];

    for (const item of itemsToSync) {
      try {
        const success = await this.syncItem();
        if (success) {
          successfulSyncs.push(item.id);
        } else {
          item.retries++;
          if (item.retries < item.maxRetries) {
            failedSyncs.push(item);
          } else {
            console.warn(`Max retries exceeded for sync item ${item.id}`);
            analytics.trackEvent('sync_item_failed', {
              id: item.id,
              action: item.action,
              retries: item.retries
            });
          }
        }
      } catch (error) {
        console.error(`Failed to sync item ${item.id}:`, error);
        item.retries++;
        if (item.retries < item.maxRetries) {
          failedSyncs.push(item);
        }
      }
    }

    // Update sync queue
    this.syncQueue = failedSyncs;
    this.saveSyncQueue();

    if (successfulSyncs.length > 0) {
      console.log(`Successfully synced ${successfulSyncs.length} items`);
      analytics.trackEvent('sync_completed', {
        successful: successfulSyncs.length,
        failed: failedSyncs.length
      });
    }

    this.syncInProgress = false;
  }

  // Sync individual item
  private async syncItem(): Promise<boolean> {
    // This would be implemented based on your specific API
    // For now, we'll simulate the sync process
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate 90% success rate
        resolve(Math.random() > 0.1);
      }, 1000);
    });
  }

  // Get sync queue status
  getSyncQueueStatus() {
    return {
      totalItems: this.syncQueue.length,
      pendingItems: this.syncQueue.filter(item => item.retries < item.maxRetries).length,
      failedItems: this.syncQueue.filter(item => item.retries >= item.maxRetries).length,
      isOnline: this.isOnline,
      syncInProgress: this.syncInProgress
    };
  }

  // Clear sync queue
  clearSyncQueue() {
    this.syncQueue = [];
    this.saveSyncQueue();
    analytics.trackEvent('sync_queue_cleared');
  }

  // Save offline data to localStorage
  private saveOfflineData() {
    try {
      const data = Array.from(this.offlineData.entries());
      localStorage.setItem('offline-data', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save offline data:', error);
    }
  }

  // Load offline data from localStorage
  private loadOfflineData() {
    try {
      const savedData = localStorage.getItem('offline-data');
      if (savedData) {
        const data = JSON.parse(savedData);
        this.offlineData = new Map(data);
      }
    } catch (error) {
      console.error('Failed to load offline data:', error);
      this.offlineData = new Map();
    }
  }

  // Save sync queue to localStorage
  private saveSyncQueue() {
    try {
      localStorage.setItem('sync-queue', JSON.stringify(this.syncQueue));
    } catch (error) {
      console.error('Failed to save sync queue:', error);
    }
  }

  // Get offline data summary
  getOfflineDataSummary() {
    const now = Date.now();
    const validData = Array.from(this.offlineData.entries()).filter(([, data]) => 
      now - data.timestamp <= data.ttl
    );

    return {
      totalCachedItems: this.offlineData.size,
      validCachedItems: validData.length,
      expiredItems: this.offlineData.size - validData.length,
      cacheSize: JSON.stringify(Array.from(this.offlineData.entries())).length
    };
  }

  // Clean up expired data
  cleanupExpiredData() {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, data] of this.offlineData.entries()) {
      if (now - data.timestamp > data.ttl) {
        this.offlineData.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      this.saveOfflineData();
      console.log(`Cleaned up ${cleanedCount} expired cache items`);
    }

    return cleanedCount;
  }

  // Force sync (for manual sync button)
  async forceSync() {
    if (!this.isOnline) {
      throw new Error('Cannot sync while offline');
    }

    return await this.syncPendingChanges();
  }
}

// Export singleton instance
export const offlineSupport = new OfflineSupportManager();

// React hook for offline support
export function useOfflineSupport() {
  const cacheData = (key: string, data: Record<string, unknown>, ttl?: number) => {
    offlineSupport.cacheData(key, data, ttl);
  };

  const getCachedData = (key: string): Record<string, unknown> | null => {
    return offlineSupport.getCachedData(key);
  };

  const isDataAvailableOffline = (key: string) => {
    return offlineSupport.isDataAvailableOffline(key);
  };

  const addToSyncQueue = (action: SyncQueueItem['action'], data: Record<string, unknown>, id?: string) => {
    offlineSupport.addToSyncQueue(action, data, id);
  };

  const forceSync = async () => {
    return await offlineSupport.forceSync();
  };

  const getSyncStatus = () => {
    return offlineSupport.getSyncQueueStatus();
  };

  const getOfflineDataSummary = () => {
    return offlineSupport.getOfflineDataSummary();
  };

  const cleanupExpiredData = () => {
    return offlineSupport.cleanupExpiredData();
  };

  return {
    cacheData,
    getCachedData,
    isDataAvailableOffline,
    addToSyncQueue,
    forceSync,
    getSyncStatus,
    getOfflineDataSummary,
    cleanupExpiredData,
    isOnline: offlineSupport['isOnline']
  };
}
