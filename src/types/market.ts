export interface Candles {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface PreviousDayData {
  high: number;
  low: number;
  close: number;
  open: number;
  timestamp: string;
}

export interface SectorMove {
  sector: string;
  changePct: number;
  bias?: 'Bullish' | 'Bearish' | 'Neutral';
}

export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  sentiment?: 'Positive' | 'Negative' | 'Neutral';
  biasImpact?: boolean;
}

export interface MarketBias {
  index: 'NIFTY' | 'BANKNIFTY' | 'FINNIFTY';
  bias: 'Bullish' | 'Bearish' | 'Neutral';
  confidence: number; // 0-100
  score: number; // -100 to +100
  lastUpdated: string;
  rationale: string[];
  invalidationLevel?: number;
  primaryTrigger?: string;
}

export interface KeyLevels {
  pdh: number; // Previous Day High
  pdl: number; // Previous Day Low
  mid: number; // Mid of yesterday H/L/C
  weeklyHigh: number;
  weeklyLow: number;
  roundNumbers: number[];
}

export interface First15mData {
  high: number;
  low: number;
  isComplete: boolean;
  timestamp: string;
}

export interface HTFContext {
  dailyTrend: 'Bullish' | 'Bearish' | 'Neutral';
  fourHourTrend: 'Bullish' | 'Bearish' | 'Neutral';
  structure: 'HH_HL' | 'LH_LL' | 'Neutral';
  gapDirection?: 'Up' | 'Down' | 'None';
  gapPercentage?: number;
}

export interface RiskGuidelines {
  stopLevel: number;
  maxRiskPerTrade: number;
  invalidationLevel: number;
}

export interface UserSettings {
  timezone: string;
  refreshCadence: {
    preOpen: string; // 09:00 IST
    postOpen: string; // 09:30 IST
    midDay: string; // 12:00 IST
    close: string; // 15:35 IST
  };
  useLiveData: boolean;
  cacheTTL: number; // minutes
  riskPerTrade: number; // percentage
  defaultInstrument: 'NIFTY' | 'BANKNIFTY';
  showAdvancedLevels: boolean;
  theme: 'light' | 'dark' | 'system';
}

export interface StockInfo {
  symbol: string;
  name: string;
  lastPrice: number;
  change: number;
  changePercent: number;
  bias?: 'Bullish' | 'Bearish' | 'Neutral';
  previousDayRange: {
    high: number;
    low: number;
  };
  preOpenNote?: string;
}

export type IndexSymbol = 'NIFTY' | 'BANKNIFTY' | 'FINNIFTY';
export type TimeFrame = '1D' | '4H' | '1H' | '15m';
export type BiasType = 'Bullish' | 'Bearish' | 'Neutral';
export type SentimentType = 'Positive' | 'Negative' | 'Neutral';
