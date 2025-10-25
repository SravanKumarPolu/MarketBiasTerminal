export interface UserPreferences {
  // Layout preferences
  layout: {
    dashboardLayout: 'grid' | 'list' | 'compact';
    sidebarCollapsed: boolean;
    cardSize: 'small' | 'medium' | 'large';
    showAdvancedMetrics: boolean;
    defaultView: 'overview' | 'detailed' | 'minimal';
  };
  
  // Display preferences
  display: {
    theme: 'light' | 'dark' | 'system';
    fontSize: 'small' | 'medium' | 'large';
    density: 'compact' | 'comfortable' | 'spacious';
    animations: boolean;
    reducedMotion: boolean;
    highContrast: boolean;
  };
  
  // Data preferences
  data: {
    refreshInterval: number; // in minutes
    autoRefresh: boolean;
    showRealTimeData: boolean;
    defaultInstrument: 'NIFTY' | 'BANKNIFTY';
    showAdvancedLevels: boolean;
    showSentimentScores: boolean;
    showNewsSentiment: boolean;
  };
  
  // Notification preferences
  notifications: {
    enablePush: boolean;
    enableEmail: boolean;
    enableSound: boolean;
    biasAlerts: boolean;
    levelBreaks: boolean;
    newsAlerts: boolean;
    marketOpen: boolean;
    marketClose: boolean;
  };
  
  // Saved views
  savedViews: SavedView[];
  
  // Custom layouts
  customLayouts: CustomLayout[];
}

export interface SavedView {
  id: string;
  name: string;
  description?: string;
  layout: DashboardLayout;
  filters: ViewFilters;
  createdAt: Date;
  updatedAt: Date;
  isDefault?: boolean;
}

export interface DashboardLayout {
  sections: LayoutSection[];
  gridColumns: number;
  gridRows: number;
  gap: number;
}

export interface LayoutSection {
  id: string;
  type: 'bias' | 'levels' | 'news' | 'sectors' | 'chart' | 'custom';
  position: { x: number; y: number };
  size: { width: number; height: number };
  config: Record<string, string | number | boolean>;
  visible: boolean;
}

export interface ViewFilters {
  instruments: ('NIFTY' | 'BANKNIFTY')[];
  timeRange: '1h' | '4h' | '1d' | '1w' | '1m';
  sectors?: string[];
  newsSources?: string[];
  sentimentRange?: { min: number; max: number };
}

export interface CustomLayout {
  id: string;
  name: string;
  description?: string;
  layout: DashboardLayout;
  isPublic: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences: UserPreferences;
  subscription: {
    plan: 'free' | 'premium' | 'pro';
    features: string[];
    limits: Record<string, number>;
  };
  analytics: {
    totalSessions: number;
    lastActive: Date;
    favoriteInstruments: string[];
    mostUsedFeatures: string[];
  };
}

export interface LayoutTemplate {
  id: string;
  name: string;
  description: string;
  category: 'trading' | 'analysis' | 'news' | 'minimal';
  layout: DashboardLayout;
  preview: string;
  isPopular: boolean;
  tags: string[];
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  layout: {
    dashboardLayout: 'grid',
    sidebarCollapsed: false,
    cardSize: 'medium',
    showAdvancedMetrics: false,
    defaultView: 'overview'
  },
  display: {
    theme: 'system',
    fontSize: 'medium',
    density: 'comfortable',
    animations: true,
    reducedMotion: false,
    highContrast: false
  },
  data: {
    refreshInterval: 15,
    autoRefresh: true,
    showRealTimeData: false,
    defaultInstrument: 'NIFTY',
    showAdvancedLevels: false,
    showSentimentScores: true,
    showNewsSentiment: true
  },
  notifications: {
    enablePush: true,
    enableEmail: false,
    enableSound: true,
    biasAlerts: true,
    levelBreaks: false,
    newsAlerts: true,
    marketOpen: true,
    marketClose: false
  },
  savedViews: [],
  customLayouts: []
};

export const LAYOUT_TEMPLATES: LayoutTemplate[] = [
  {
    id: 'trading-focused',
    name: 'Trading Focused',
    description: 'Optimized for active trading with bias cards and key levels',
    category: 'trading',
    layout: {
      sections: [
        { id: 'nifty-bias', type: 'bias', position: { x: 0, y: 0 }, size: { width: 1, height: 1 }, config: { instrument: 'NIFTY' }, visible: true },
        { id: 'banknifty-bias', type: 'bias', position: { x: 1, y: 0 }, size: { width: 1, height: 1 }, config: { instrument: 'BANKNIFTY' }, visible: true },
        { id: 'levels', type: 'levels', position: { x: 0, y: 1 }, size: { width: 2, height: 1 }, config: {}, visible: true },
        { id: 'news', type: 'news', position: { x: 0, y: 2 }, size: { width: 1, height: 1 }, config: { limit: 5 }, visible: true },
        { id: 'sectors', type: 'sectors', position: { x: 1, y: 2 }, size: { width: 1, height: 1 }, config: {}, visible: true }
      ],
      gridColumns: 2,
      gridRows: 3,
      gap: 16
    },
    preview: '/templates/trading-focused.png',
    isPopular: true,
    tags: ['trading', 'bias', 'levels']
  },
  {
    id: 'news-focused',
    name: 'News Focused',
    description: 'Emphasizes news and sentiment analysis',
    category: 'news',
    layout: {
      sections: [
        { id: 'news', type: 'news', position: { x: 0, y: 0 }, size: { width: 2, height: 2 }, config: { limit: 10 }, visible: true },
        { id: 'nifty-bias', type: 'bias', position: { x: 0, y: 2 }, size: { width: 1, height: 1 }, config: { instrument: 'NIFTY' }, visible: true },
        { id: 'banknifty-bias', type: 'bias', position: { x: 1, y: 2 }, size: { width: 1, height: 1 }, config: { instrument: 'BANKNIFTY' }, visible: true }
      ],
      gridColumns: 2,
      gridRows: 3,
      gap: 16
    },
    preview: '/templates/news-focused.png',
    isPopular: false,
    tags: ['news', 'sentiment', 'analysis']
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean, minimal layout with essential information only',
    category: 'minimal',
    layout: {
      sections: [
        { id: 'nifty-bias', type: 'bias', position: { x: 0, y: 0 }, size: { width: 1, height: 1 }, config: { instrument: 'NIFTY' }, visible: true },
        { id: 'banknifty-bias', type: 'bias', position: { x: 1, y: 0 }, size: { width: 1, height: 1 }, config: { instrument: 'BANKNIFTY' }, visible: true }
      ],
      gridColumns: 2,
      gridRows: 1,
      gap: 16
    },
    preview: '/templates/minimal.png',
    isPopular: true,
    tags: ['minimal', 'clean', 'simple']
  }
];
