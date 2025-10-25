// Feature Flags Configuration
// This file controls which features are enabled/disabled
import { debug } from '@/utils/debug';

export const featureFlags = {
  // Data Source Features
  ENABLE_LIVE_DATA: process.env.ENABLE_LIVE_DATA === 'true' || false,
  ENABLE_MOCK_DATA: process.env.USE_MOCK_DATA !== 'false', // Default true
  
  // News Features
  ENABLE_NEWS_FETCH: process.env.ENABLE_NEWS_FETCH !== 'false', // Default true
  ENABLE_SENTIMENT_ANALYSIS: true,
  
  // Sector Analysis
  ENABLE_SECTOR_ANALYSIS: process.env.ENABLE_SECTOR_ANALYSIS !== 'false', // Default true
  
  // Stock Watchlist
  ENABLE_STOCK_WATCHLIST: true,
  
  // Advanced Features
  ENABLE_ADVANCED_LEVELS: false, // Can be enabled in settings
  ENABLE_FIRST_15M_TRACKING: true,
  ENABLE_BIAS_INVALIDATION: true,
  
  // Performance Features
  ENABLE_LAZY_LOADING: true,
  ENABLE_CACHING: true,
  ENABLE_DEBOUNCING: true,
  
  // Debug Features
  ENABLE_DEBUG_LOGGING: process.env.DEBUG_MODE === 'true' || false,
  ENABLE_PERFORMANCE_MONITORING: true,
  
  // Analytics Features
  ENABLE_ANALYTICS: process.env.ENABLE_ANALYTICS !== 'false', // Default true
  ENABLE_USER_FEEDBACK: true,
  ENABLE_ONBOARDING: true,
  
  // UI Features
  ENABLE_DARK_MODE: true,
  ENABLE_KEYBOARD_NAVIGATION: true,
  ENABLE_MOBILE_OPTIMIZATION: true,
  
  // Data Source Priorities (order matters)
  DATA_SOURCE_PRIORITY: [
    'live',
    'mock'
  ] as const,
  
  // Cache Configuration
  CACHE_CONFIG: {
    DEFAULT_TTL: parseInt(process.env.DEFAULT_CACHE_TTL || '15') * 60 * 1000, // Convert to milliseconds
    NEWS_TTL: parseInt(process.env.NEWS_CACHE_TTL || '30') * 60 * 1000,
    STOCK_TTL: parseInt(process.env.STOCK_CACHE_TTL || '5') * 60 * 1000,
    BIAS_TTL: 15 * 60 * 1000, // 15 minutes
    LEVELS_TTL: 60 * 60 * 1000, // 1 hour
  },
  
  // API Configuration
  API_CONFIG: {
    TIMEOUT: parseInt(process.env.API_TIMEOUT || '5000'),
    MAX_RETRIES: parseInt(process.env.MAX_RETRY_ATTEMPTS || '3'),
    DEBOUNCE_DELAY: parseInt(process.env.DEBOUNCE_DELAY || '300'),
  },
  
  // Market Configuration
  MARKET_CONFIG: {
    TIMEZONE: 'Asia/Kolkata', // Hardcoded as required
    TRADING_HOURS: {
      PRE_OPEN: '09:00',
      OPEN: '09:15',
      CLOSE: '15:30',
      POST_CLOSE: '15:35',
    },
    REFRESH_SCHEDULE: {
      PRE_MARKET: '09:00',
      POST_OPEN: '09:30',
      MID_DAY: '12:00',
      POST_CLOSE: '15:35',
    },
  },
  
  // Sentiment Analysis Configuration
  SENTIMENT_CONFIG: {
    POSITIVE_THRESHOLD: 2,
    NEGATIVE_THRESHOLD: -2,
    MAX_SCORE: 20,
    MIN_SCORE: -20,
    KEYWORD_WEIGHT: 2,
    RELEVANCE_BOOST: 3,
  },
  
  // Bias Engine Configuration
  BIAS_CONFIG: {
    HTF_WEIGHT: 60, // Higher timeframe weight
    RANGE_WEIGHT: 20,
    GAP_WEIGHT: 20,
    MOMENTUM_WEIGHT: 20,
    NEWS_WEIGHT: 20,
    BULLISH_THRESHOLD: 15,
    BEARISH_THRESHOLD: -15,
    MAX_SCORE: 100,
    MIN_SCORE: -100,
  },
} as const;

// Helper functions
export const isFeatureEnabled = (feature: keyof typeof featureFlags): boolean => {
  return featureFlags[feature] as boolean;
};

export const getCacheTTL = (type: keyof typeof featureFlags.CACHE_CONFIG): number => {
  return featureFlags.CACHE_CONFIG[type];
};

export const getAPIConfig = () => {
  return featureFlags.API_CONFIG;
};

export const getMarketConfig = () => {
  return featureFlags.MARKET_CONFIG;
};

export const getSentimentConfig = () => {
  return featureFlags.SENTIMENT_CONFIG;
};

export const getBiasConfig = () => {
  return featureFlags.BIAS_CONFIG;
};

// Development helpers
export const logFeatureFlags = () => {
  if (featureFlags.ENABLE_DEBUG_LOGGING) {
    debug.log('Feature Flags:', featureFlags);
  }
};

// Validate configuration
export const validateFeatureFlags = () => {
  const errors: string[] = [];
  
  // Check cache TTL values
  Object.entries(featureFlags.CACHE_CONFIG).forEach(([key, value]) => {
    if (value <= 0) {
      errors.push(`Invalid cache TTL for ${key}: ${value}`);
    }
  });
  
  // Check API timeout
  if (featureFlags.API_CONFIG.TIMEOUT <= 0) {
    errors.push('Invalid API timeout value');
  }
  
  // Check retry attempts
  if (featureFlags.API_CONFIG.MAX_RETRIES < 0) {
    errors.push('Invalid max retry attempts');
  }
  
  if (errors.length > 0) {
    console.error('Feature flag validation errors:', errors);
    return false;
  }
  
  return true;
};

// Initialize feature flags
if (typeof window !== 'undefined') {
  logFeatureFlags();
  validateFeatureFlags();
}
