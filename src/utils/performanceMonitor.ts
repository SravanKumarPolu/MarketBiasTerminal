'use client';

import { featureFlags } from '@/config/featureFlags';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
  networkLatency?: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = featureFlags.ENABLE_PERFORMANCE_MONITORING;
  }

  /**
   * Start monitoring performance metrics
   */
  startMonitoring(): void {
    if (!this.isEnabled || typeof window === 'undefined') return;

    // Monitor page load performance
    window.addEventListener('load', () => {
      this.recordLoadMetrics();
    });

    // Monitor navigation timing
    if ('performance' in window && 'getEntriesByType' in window.performance) {
      this.recordNavigationMetrics();
    }

    // Monitor memory usage (if available)
    if ('memory' in performance) {
      this.recordMemoryMetrics();
    }
  }

  /**
   * Record page load metrics
   */
  private recordLoadMetrics(): void {
    if (!this.isEnabled) return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigation) {
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
      const renderTime = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;

      this.metrics.push({
        loadTime,
        renderTime,
        networkLatency: navigation.responseEnd - navigation.requestStart,
      });

      this.logMetrics('Page Load', { loadTime, renderTime });
    }
  }

  /**
   * Record navigation timing metrics
   */
  private recordNavigationMetrics(): void {
    if (!this.isEnabled) return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigation) {
      const metrics = {
        dns: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcp: navigation.connectEnd - navigation.connectStart,
        request: navigation.responseEnd - navigation.requestStart,
        dom: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        load: navigation.loadEventEnd - navigation.loadEventStart,
      };

      this.logMetrics('Navigation Timing', metrics);
    }
  }

  /**
   * Record memory usage metrics
   */
  private recordMemoryMetrics(): void {
    if (!this.isEnabled) return;

    const memory = (performance as Performance & { memory?: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
    if (memory) {
      const metrics = {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
      };

      this.logMetrics('Memory Usage', metrics);
    }
  }

  /**
   * Record custom metrics
   */
  recordCustomMetric(name: string, value: number, context?: Record<string, string | number | boolean>): void {
    if (!this.isEnabled) return;

    this.logMetrics(`Custom: ${name}`, { value, ...context });
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary(): {
    averageLoadTime: number;
    averageRenderTime: number;
    totalMetrics: number;
    recommendations: string[];
  } {
    if (this.metrics.length === 0) {
      return {
        averageLoadTime: 0,
        averageRenderTime: 0,
        totalMetrics: 0,
        recommendations: ['No performance data available'],
      };
    }

    const averageLoadTime = this.metrics.reduce((sum, m) => sum + m.loadTime, 0) / this.metrics.length;
    const averageRenderTime = this.metrics.reduce((sum, m) => sum + m.renderTime, 0) / this.metrics.length;

    const recommendations: string[] = [];
    
    if (averageLoadTime > 3000) {
      recommendations.push('Consider optimizing bundle size and implementing code splitting');
    }
    
    if (averageRenderTime > 1000) {
      recommendations.push('Consider optimizing component rendering and reducing DOM complexity');
    }

    if (this.metrics.some(m => m.memoryUsage && m.memoryUsage > 50 * 1024 * 1024)) {
      recommendations.push('Consider implementing memory optimization strategies');
    }

    return {
      averageLoadTime,
      averageRenderTime,
      totalMetrics: this.metrics.length,
      recommendations,
    };
  }

  /**
   * Log metrics to console (only in development)
   */
  private logMetrics(label: string, metrics: Record<string, string | number | boolean>): void {
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚀 Performance: ${label}`);
      Object.entries(metrics).forEach(([key, value]) => {
        console.log(`${key}: ${typeof value === 'number' ? `${value.toFixed(2)}ms` : value}`);
      });
      console.groupEnd();
    }
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics = [];
  }

  /**
   * Get current metrics
   */
  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Auto-start monitoring if enabled
if (typeof window !== 'undefined') {
  performanceMonitor.startMonitoring();
}

// Export types
export type { PerformanceMetrics };
