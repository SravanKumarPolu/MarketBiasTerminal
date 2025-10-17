import { useMarketStore } from '@/store/marketStore';

export class MarketScheduler {
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private isActive = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeScheduler();
    }
  }

  private initializeScheduler() {
    // Start scheduler on client side
    this.start();
    
    // Handle visibility change to pause/resume when tab is not active
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pause();
      } else {
        this.resume();
      }
    });
  }

  start() {
    if (this.isActive) return;
    this.isActive = true;

    // Schedule different refresh intervals based on market status
    this.schedulePreMarket();
    this.scheduleMarketHours();
    this.schedulePostMarket();
    
    console.log('Market scheduler started');
  }

  stop() {
    this.isActive = false;
    
    // Clear all intervals
    this.intervals.forEach((interval) => {
      clearInterval(interval);
    });
    this.intervals.clear();
    
    console.log('Market scheduler stopped');
  }

  pause() {
    this.intervals.forEach((interval) => {
      clearInterval(interval);
    });
    this.intervals.clear();
  }

  resume() {
    if (this.isActive) {
      this.start();
    }
  }

  private schedulePreMarket() {
    // Pre-market refresh at 9:00 AM IST
    this.scheduleAtTime('09:00', () => {
      this.refreshData('pre-market');
    });
  }

  private scheduleMarketHours() {
    // Post-open refresh at 9:30 AM IST (after first 15m)
    this.scheduleAtTime('09:30', () => {
      this.refreshData('post-open');
    });

    // Mid-day refresh at 12:00 PM IST
    this.scheduleAtTime('12:00', () => {
      this.refreshData('mid-day');
    });
  }

  private schedulePostMarket() {
    // Post-close refresh at 3:35 PM IST
    this.scheduleAtTime('15:35', () => {
      this.refreshData('post-close');
    });
  }

  private scheduleAtTime(time: string, callback: () => void) {
    const now = new Date();
    const istTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    
    const [hours, minutes] = time.split(':').map(Number);
    const targetTime = new Date(istTime);
    targetTime.setHours(hours, minutes, 0, 0);
    
    // If target time has passed today, schedule for tomorrow
    if (targetTime <= istTime) {
      targetTime.setDate(targetTime.getDate() + 1);
    }
    
    const delay = targetTime.getTime() - istTime.getTime();
    
    const timeoutId = setTimeout(() => {
      callback();
      // Schedule for next day
      this.scheduleAtTime(time, callback);
    }, delay);
    
    this.intervals.set(time, timeoutId as NodeJS.Timeout);
  }

  private async refreshData(context: string) {
    console.log(`Scheduled refresh: ${context}`);
    
    try {
      const { fetchMarketData } = useMarketStore.getState();
      await fetchMarketData();
    } catch (error) {
      console.error(`Failed to refresh data for ${context}:`, error);
    }
  }

  // Manual refresh methods
  async refreshNow() {
    console.log('Manual refresh triggered');
    await this.refreshData('manual');
  }

  // Check if it's a trading day
  isTradingDay(): boolean {
    const now = new Date();
    const istTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const day = istTime.getDay();
    
    // Market is closed on weekends
    return day !== 0 && day !== 6; // Sunday = 0, Saturday = 6
  }

  // Get next market open time
  getNextMarketOpen(): Date {
    const now = new Date();
    const istTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    
    // Market opens at 9:15 AM IST
    const nextOpen = new Date(istTime);
    nextOpen.setHours(9, 15, 0, 0);
    
    // If market is already open today, get next trading day
    if (nextOpen <= istTime) {
      nextOpen.setDate(nextOpen.getDate() + 1);
    }
    
    // Skip weekends
    while (nextOpen.getDay() === 0 || nextOpen.getDay() === 6) {
      nextOpen.setDate(nextOpen.getDate() + 1);
    }
    
    return nextOpen;
  }

  // Get market status
  getMarketStatus(): { isOpen: boolean; nextOpen?: Date; message: string } {
    const now = new Date();
    const istTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const day = istTime.getDay();
    const hour = istTime.getHours();
    const minute = istTime.getMinutes();
    
    // Check if weekend
    if (day === 0 || day === 6) {
      const nextOpen = this.getNextMarketOpen();
      return {
        isOpen: false,
        nextOpen,
        message: 'Market closed (Weekend)'
      };
    }
    
    // Check market hours (9:15 AM to 3:30 PM IST)
    const marketOpen = 9 * 60 + 15;
    const marketClose = 15 * 60 + 30;
    const currentMinutes = hour * 60 + minute;
    
    if (currentMinutes < marketOpen) {
      const nextOpen = new Date(istTime);
      nextOpen.setHours(9, 15, 0, 0);
      return {
        isOpen: false,
        nextOpen,
        message: 'Market closed (Pre-market)'
      };
    } else if (currentMinutes > marketClose) {
      const nextOpen = this.getNextMarketOpen();
      return {
        isOpen: false,
        nextOpen,
        message: 'Market closed (Post-market)'
      };
    } else {
      return {
        isOpen: true,
        message: 'Market is open'
      };
    }
  }
}

// Singleton instance
export const marketScheduler = new MarketScheduler();
