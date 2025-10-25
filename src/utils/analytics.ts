// Analytics utility for tracking user behavior and engagement
// This provides a foundation for analytics integration

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, string | number | boolean>;
  timestamp?: number;
}

interface UserBehavior {
  pageViews: number;
  timeOnPage: number;
  interactions: number;
  lastActivity: number;
}

class AnalyticsTracker {
  private events: AnalyticsEvent[] = [];
  private userBehavior: UserBehavior = {
    pageViews: 0,
    timeOnPage: 0,
    interactions: 0,
    lastActivity: Date.now()
  };
  private sessionStart: number = Date.now();

  // Track page views
  trackPageView(page: string, properties?: Record<string, string | number | boolean>) {
    this.userBehavior.pageViews++;
    this.trackEvent('page_view', {
      page,
      ...properties
    });
  }

  // Track user interactions
  trackInteraction(action: string, element: string, properties?: Record<string, string | number | boolean>) {
    this.userBehavior.interactions++;
    this.userBehavior.lastActivity = Date.now();
    
    this.trackEvent('interaction', {
      action,
      element,
      ...properties
    });
  }

  // Track bias card interactions
  trackBiasInteraction(index: 'NIFTY' | 'BANKNIFTY', action: string, properties?: Record<string, string | number | boolean>) {
    this.trackInteraction('bias_interaction', `${index}_bias`, {
      index,
      action,
      ...properties
    });
  }

  // Track level copying
  trackLevelCopy(index: 'NIFTY' | 'BANKNIFTY', level: string, value: number) {
    this.trackInteraction('level_copy', `${index}_levels`, {
      index,
      level,
      value
    });
  }

  // Track news interactions
  trackNewsInteraction(action: string, newsId: string, properties?: Record<string, string | number | boolean>) {
    this.trackInteraction('news_interaction', 'news_item', {
      action,
      newsId,
      ...properties
    });
  }

  // Track sector interactions
  trackSectorInteraction(sector: string, action: string, properties?: Record<string, string | number | boolean>) {
    this.trackInteraction('sector_interaction', 'sector_heatmap', {
      sector,
      action,
      ...properties
    });
  }

  // Track onboarding completion
  trackOnboardingComplete(stepsCompleted: number, timeToComplete: number) {
    this.trackEvent('onboarding_complete', {
      stepsCompleted,
      timeToComplete,
      completionRate: (stepsCompleted / 6) * 100
    });
  }

  // Track CTA clicks
  trackCTAClick(ctaType: string, location: string, properties?: Record<string, string | number | boolean>) {
    this.trackInteraction('cta_click', ctaType, {
      location,
      ...properties
    });
  }

  // Track performance metrics
  trackPerformance(metric: string, value: number, properties?: Record<string, string | number | boolean>) {
    this.trackEvent('performance_metric', {
      metric,
      value,
      ...properties
    });
  }

  // Track errors
  trackError(error: string, context: string, properties?: Record<string, string | number | boolean>) {
    this.trackEvent('error', {
      error,
      context,
      ...properties
    });
  }

  // Track user engagement
  trackEngagement(action: string, properties?: Record<string, string | number | boolean>) {
    this.trackEvent('engagement', {
      action,
      sessionDuration: Date.now() - this.sessionStart,
      ...properties
    });
  }

  // Generic event tracking
  trackEvent(event: string, properties?: Record<string, string | number | boolean>) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        timestamp: Date.now(),
        sessionId: this.getSessionId(),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
        url: typeof window !== 'undefined' ? window.location.href : 'server'
      }
    };

    this.events.push(analyticsEvent);
    this.userBehavior.lastActivity = Date.now();

    // In a real implementation, you would send this to your analytics service
    this.sendToAnalytics(analyticsEvent);
  }

  // Get session ID
  private getSessionId(): string {
    if (typeof window === 'undefined') return 'server';
    
    let sessionId = sessionStorage.getItem('analytics-session-id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics-session-id', sessionId);
    }
    return sessionId;
  }

  // Send to analytics service (placeholder for actual implementation)
  private sendToAnalytics(event: AnalyticsEvent) {
    // In a real implementation, you would send to Google Analytics, Mixpanel, etc.
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', event);
    }
    
    // Example: Send to Google Analytics
    // if (typeof window !== 'undefined' && window.gtag) {
    //   window.gtag('event', event.event, event.properties);
    // }
  }

  // Get user behavior summary
  getUserBehavior(): UserBehavior {
    return {
      ...this.userBehavior,
      timeOnPage: Date.now() - this.sessionStart
    };
  }

  // Get all events
  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  // Clear events (for privacy)
  clearEvents() {
    this.events = [];
  }
}

// Singleton instance
export const analytics = new AnalyticsTracker();

// React hook for analytics
export function useAnalytics() {
  const trackPageView = (page: string, properties?: Record<string, string | number | boolean>) => {
    analytics.trackPageView(page, properties);
  };

  const trackInteraction = (action: string, element: string, properties?: Record<string, string | number | boolean>) => {
    analytics.trackInteraction(action, element, properties);
  };

  const trackBiasInteraction = (index: 'NIFTY' | 'BANKNIFTY', action: string, properties?: Record<string, string | number | boolean>) => {
    analytics.trackBiasInteraction(index, action, properties);
  };

  const trackLevelCopy = (index: 'NIFTY' | 'BANKNIFTY', level: string, value: number) => {
    analytics.trackLevelCopy(index, level, value);
  };

  const trackNewsInteraction = (action: string, newsId: string, properties?: Record<string, string | number | boolean>) => {
    analytics.trackNewsInteraction(action, newsId, properties);
  };

  const trackSectorInteraction = (sector: string, action: string, properties?: Record<string, string | number | boolean>) => {
    analytics.trackSectorInteraction(sector, action, properties);
  };

  const trackCTAClick = (ctaType: string, location: string, properties?: Record<string, string | number | boolean>) => {
    analytics.trackCTAClick(ctaType, location, properties);
  };

  const trackError = (error: string, context: string, properties?: Record<string, string | number | boolean>) => {
    analytics.trackError(error, context, properties);
  };

  return {
    trackPageView,
    trackInteraction,
    trackBiasInteraction,
    trackLevelCopy,
    trackNewsInteraction,
    trackSectorInteraction,
    trackCTAClick,
    trackError,
    getUserBehavior: analytics.getUserBehavior.bind(analytics),
    getEvents: analytics.getEvents.bind(analytics)
  };
}

// Performance monitoring
export function trackPerformance(metric: string, value: number, properties?: Record<string, string | number | boolean>) {
  analytics.trackPerformance(metric, value, properties);
}

// Error tracking
export function trackError(error: string, context: string, properties?: Record<string, string | number | boolean>) {
  analytics.trackError(error, context, properties);
}
