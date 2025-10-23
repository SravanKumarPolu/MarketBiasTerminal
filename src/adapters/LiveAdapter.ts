import { BaseDataSource } from './MarketDataSource';
import { MockAdapter } from './MockAdapter';
import { Candles, PreviousDayData, SectorMove, NewsItem, StockInfo } from '@/types/market';

export class LiveAdapter extends BaseDataSource {
  private mockAdapter: MockAdapter;
  private useMockFallback: boolean = true;
  private apiKey: string | null = null;

  constructor() {
    super('https://api.example.com'); // Replace with actual API endpoints
    this.mockAdapter = new MockAdapter();
    
    // Check for API key in environment variables
    if (typeof window !== 'undefined') {
      this.apiKey = process.env.NEXT_PUBLIC_API_KEY || null;
    }
  }

  async getIndexOHLC(symbol: 'NIFTY' | 'BANKNIFTY', tf: '1D' | '4H' | '1H' | '15m'): Promise<Candles[]> {
    if (this.useMockFallback || !this.apiKey) {
      return this.mockAdapter.getIndexOHLC(symbol, tf);
    }

    try {
      // TODO: Replace with actual API endpoint
      // const url = `${this.baseUrl}/ohlc/${symbol}/${tf}`;
      // const headers = this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {};
      // return await this.fetchWithRetry<Candles[]>(url, { headers });
      
      // For now, fallback to mock
      return this.mockAdapter.getIndexOHLC(symbol, tf);
    } catch (error) {
      console.warn('Live API failed, falling back to mock data:', error);
      return this.mockAdapter.getIndexOHLC(symbol, tf);
    }
  }

  async getPreviousDayHL(symbol: 'NIFTY' | 'BANKNIFTY'): Promise<PreviousDayData> {
    if (this.useMockFallback) {
      return this.mockAdapter.getPreviousDayHL(symbol);
    }

    try {
      // TODO: Replace with actual API endpoint
      // const url = `${this.baseUrl}/previous-day/${symbol}`;
      // return await this.fetchWithRetry<PreviousDayData>(url);
      
      return this.mockAdapter.getPreviousDayHL(symbol);
    } catch (error) {
      console.warn('Live API failed, falling back to mock data:', error);
      return this.mockAdapter.getPreviousDayHL(symbol);
    }
  }

  async getSectorMoves(): Promise<SectorMove[]> {
    if (this.useMockFallback) {
      return this.mockAdapter.getSectorMoves();
    }

    try {
      // TODO: Replace with actual API endpoint
      // const url = `${this.baseUrl}/sectors`;
      // return await this.fetchWithRetry<SectorMove[]>(url);
      
      return this.mockAdapter.getSectorMoves();
    } catch (error) {
      console.warn('Live API failed, falling back to mock data:', error);
      return this.mockAdapter.getSectorMoves();
    }
  }

  async getConstituents(index: 'NIFTY50'): Promise<string[]> {
    if (this.useMockFallback) {
      return this.mockAdapter.getConstituents(index);
    }

    try {
      // TODO: Replace with actual API endpoint
      // const url = `${this.baseUrl}/constituents/${index}`;
      // return await this.fetchWithRetry<string[]>(url);
      
      return this.mockAdapter.getConstituents(index);
    } catch (error) {
      console.warn('Live API failed, falling back to mock data:', error);
      return this.mockAdapter.getConstituents(index);
    }
  }

  async getNews(): Promise<NewsItem[]> {
    try {
      // Try to fetch from RSS feeds or news APIs
      const newsSources = [
        'https://feeds.feedburner.com/ndtvprofit-latest',
        'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms',
        'https://www.business-standard.com/rss/markets-106.rss'
      ];

      const allNews: NewsItem[] = [];
      
      for (const source of newsSources) {
        try {
          const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source)}`);
          if (response.ok) {
            const data = await response.json();
            const items = data.items?.slice(0, 3) || []; // Limit to 3 items per source
            
            items.forEach((item: { title: string; link: string; pubDate: string; author?: string }) => {
              allNews.push({
                title: item.title,
                link: item.link,
                pubDate: item.pubDate,
                source: item.author || 'RSS Feed',
              });
            });
          }
        } catch (error) {
          console.warn(`Failed to fetch news from ${source}:`, error);
        }
      }

      // If we got some news, return it; otherwise fallback to mock
      if (allNews.length > 0) {
        return allNews.slice(0, 10); // Limit to 10 items
      }
      
      return this.mockAdapter.getNews();
    } catch (error) {
      console.warn('News API failed, falling back to mock data:', error);
      return this.mockAdapter.getNews();
    }
  }

  async getStockInfo(symbols: string[]): Promise<StockInfo[]> {
    if (this.useMockFallback) {
      return this.mockAdapter.getStockInfo(symbols);
    }

    try {
      // TODO: Replace with actual API endpoint
      // const url = `${this.baseUrl}/stocks?symbols=${symbols.join(',')}`;
      // return await this.fetchWithRetry<StockInfo[]>(url);
      
      return this.mockAdapter.getStockInfo(symbols);
    } catch (error) {
      console.warn('Live API failed, falling back to mock data:', error);
      return this.mockAdapter.getStockInfo(symbols);
    }
  }

  async isMarketOpen(): Promise<boolean> {
    // This logic is the same regardless of data source
    const now = new Date();
    const istTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const day = istTime.getDay(); // 0 = Sunday, 6 = Saturday
    const hour = istTime.getHours();
    const minute = istTime.getMinutes();
    
    // Market is closed on weekends
    if (day === 0 || day === 6) return false;
    
    // Market hours: 9:15 AM to 3:30 PM IST
    const marketOpen = 9 * 60 + 15; // 9:15 AM in minutes
    const marketClose = 15 * 60 + 30; // 3:30 PM in minutes
    const currentMinutes = hour * 60 + minute;
    
    return currentMinutes >= marketOpen && currentMinutes <= marketClose;
  }

  async getTradingHolidays(): Promise<string[]> {
    // Return the same holidays as mock adapter
    return this.mockAdapter.getTradingHolidays();
  }

  // Method to enable/disable mock fallback
  setMockFallback(enabled: boolean) {
    this.useMockFallback = enabled;
  }
}
