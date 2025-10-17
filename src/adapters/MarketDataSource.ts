import { Candles, PreviousDayData, SectorMove, NewsItem, StockInfo } from '@/types/market';

export interface MarketDataSource {
  getIndexOHLC(symbol: 'NIFTY' | 'BANKNIFTY', tf: '1D' | '4H' | '1H' | '15m'): Promise<Candles[]>;
  getPreviousDayHL(symbol: 'NIFTY' | 'BANKNIFTY'): Promise<PreviousDayData>;
  getSectorMoves(): Promise<SectorMove[]>;
  getConstituents(index: 'NIFTY50'): Promise<string[]>;
  getNews(): Promise<NewsItem[]>;
  getStockInfo(symbols: string[]): Promise<StockInfo[]>;
  isMarketOpen(): Promise<boolean>;
  getTradingHolidays(): Promise<string[]>; // YYYY-MM-DD format
}

export abstract class BaseDataSource implements MarketDataSource {
  protected baseUrl: string;
  protected cache: Map<string, { data: unknown; timestamp: number; ttl: number }> = new Map();

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getUserCacheTTL(): number | null {
    try {
      if (typeof window === 'undefined') return null;
      const persisted = window.localStorage.getItem('market-store');
      if (!persisted) return null;
      const parsed = JSON.parse(persisted);
      const minutes = parsed?.state?.settings?.cacheTTL;
      if (typeof minutes === 'number' && minutes >= 5 && minutes <= 60) {
        return minutes * 60 * 1000;
      }
    } catch {}
    return null;
  }

  protected async getCachedData<T>(key: string, fetcher: () => Promise<T>, ttl: number = 15 * 60 * 1000): Promise<T> {
    const effectiveTtl = this.getUserCacheTTL() ?? ttl;
    const cached = this.cache.get(key);
    const now = Date.now();

    if (cached && (now - cached.timestamp) < cached.ttl) {
      return cached.data as T;
    }

    const data = await fetcher();
    this.cache.set(key, { data, timestamp: now, ttl: effectiveTtl });
    return data;
  }

  protected async fetchWithRetry<T>(url: string, options: RequestInit = {}, retries: number = 3): Promise<T> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
    throw new Error('Max retries exceeded');
  }

  abstract getIndexOHLC(symbol: 'NIFTY' | 'BANKNIFTY', tf: '1D' | '4H' | '1H' | '15m'): Promise<Candles[]>;
  abstract getPreviousDayHL(symbol: 'NIFTY' | 'BANKNIFTY'): Promise<PreviousDayData>;
  abstract getSectorMoves(): Promise<SectorMove[]>;
  abstract getConstituents(index: 'NIFTY50'): Promise<string[]>;
  abstract getNews(): Promise<NewsItem[]>;
  abstract getStockInfo(symbols: string[]): Promise<StockInfo[]>;
  abstract isMarketOpen(): Promise<boolean>;
  abstract getTradingHolidays(): Promise<string[]>;
}
