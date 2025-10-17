import { BaseDataSource } from './MarketDataSource';
import { Candles, PreviousDayData, SectorMove, NewsItem, StockInfo } from '@/types/market';

export class MockAdapter extends BaseDataSource {
  constructor() {
    super('mock://api');
  }

  async getIndexOHLC(symbol: 'NIFTY' | 'BANKNIFTY', tf: '1D' | '4H' | '1H' | '15m'): Promise<Candles[]> {
    return this.getCachedData(`ohlc_${symbol}_${tf}`, async () => {
      const basePrice = symbol === 'NIFTY' ? 22000 : 47000;
      const candles: Candles[] = [];
      const now = new Date();
      
      // Generate last 30 days of data
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        // Generate realistic OHLC data with some volatility
        const volatility = 0.02; // 2% daily volatility
        const open = basePrice * (1 + (Math.random() - 0.5) * volatility);
        const close = open * (1 + (Math.random() - 0.5) * volatility);
        const high = Math.max(open, close) * (1 + Math.random() * volatility * 0.5);
        const low = Math.min(open, close) * (1 - Math.random() * volatility * 0.5);
        
        candles.push({
          timestamp: date.toISOString(),
          open: Math.round(open * 100) / 100,
          high: Math.round(high * 100) / 100,
          low: Math.round(low * 100) / 100,
          close: Math.round(close * 100) / 100,
          volume: Math.floor(Math.random() * 1000000) + 500000,
        });
      }
      
      return candles;
    }, 5 * 60 * 1000); // 5 minute cache
  }

  async getPreviousDayHL(symbol: 'NIFTY' | 'BANKNIFTY'): Promise<PreviousDayData> {
    return this.getCachedData(`prev_day_${symbol}`, async () => {
      const basePrice = symbol === 'NIFTY' ? 22000 : 47000;
      const volatility = 0.02;
      
      const open = basePrice * (1 + (Math.random() - 0.5) * volatility);
      const close = open * (1 + (Math.random() - 0.5) * volatility);
      const high = Math.max(open, close) * (1 + Math.random() * volatility * 0.5);
      const low = Math.min(open, close) * (1 - Math.random() * volatility * 0.5);
      
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      return {
        high: Math.round(high * 100) / 100,
        low: Math.round(low * 100) / 100,
        close: Math.round(close * 100) / 100,
        open: Math.round(open * 100) / 100,
        timestamp: yesterday.toISOString(),
      };
    }, 24 * 60 * 60 * 1000); // 24 hour cache
  }

  async getSectorMoves(): Promise<SectorMove[]> {
    return this.getCachedData('sector_moves', async () => {
      const sectors = [
        'Banking', 'IT', 'Pharma', 'Auto', 'FMCG', 'Energy', 'Metals', 'Real Estate',
        'PSU Banks', 'Private Banks', 'NBFC', 'Insurance', 'Telecom', 'Media', 'Cement'
      ];
      
      return sectors.map(sector => {
        const changePct = (Math.random() - 0.5) * 6; // -3% to +3%
        let bias: 'Bullish' | 'Bearish' | 'Neutral' = 'Neutral';
        if (changePct > 1) bias = 'Bullish';
        else if (changePct < -1) bias = 'Bearish';
        
        return {
          sector,
          changePct: Math.round(changePct * 100) / 100,
          bias,
        };
      });
    }, 15 * 60 * 1000); // 15 minute cache
  }

  async getConstituents(index: 'NIFTY50'): Promise<string[]> {
    return this.getCachedData(`constituents_${index}`, async () => {
      // Top 50 NIFTY stocks
      return [
        'RELIANCE', 'TCS', 'HDFCBANK', 'BHARTIARTL', 'ICICIBANK', 'SBIN', 'LICI', 'ITC',
        'LT', 'HINDUNILVR', 'AXISBANK', 'MARUTI', 'SUNPHARMA', 'TITAN', 'ULTRACEMCO',
        'NESTLEIND', 'WIPRO', 'NTPC', 'TECHM', 'POWERGRID', 'BAJFINANCE', 'TATAMOTORS',
        'HCLTECH', 'KOTAKBANK', 'ASIANPAINT', 'JSWSTEEL', 'ADANIPORTS', 'ONGC', 'COALINDIA',
        'GRASIM', 'TATASTEEL', 'BAJAJFINSV', 'DRREDDY', 'BRITANNIA', 'EICHERMOT', 'APOLLOHOSP',
        'INDUSINDBK', 'CIPLA', 'HDFCLIFE', 'SBILIFE', 'DIVISLAB', 'HEROMOTOCO', 'UPL',
        'BPCL', 'TATACONSUM', 'ADANIENT', 'M&M', 'HINDALCO', 'PIDILITIND'
      ];
    }, 24 * 60 * 60 * 1000); // 24 hour cache
  }

  async getNews(): Promise<NewsItem[]> {
    return this.getCachedData('news', async () => {
      const newsItems: NewsItem[] = [
        {
          title: 'RBI keeps repo rate unchanged at 6.5%, maintains accommodative stance',
          link: '#',
          pubDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          source: 'Economic Times',
        },
        {
          title: 'NIFTY 50 reaches new all-time high on strong FII inflows',
          link: '#',
          pubDate: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
          source: 'Business Standard',
        },
        {
          title: 'Banking stocks surge after strong Q3 results from major lenders',
          link: '#',
          pubDate: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
          source: 'Mint',
        },
        {
          title: 'IT sector faces headwinds as global clients reduce spending',
          link: '#',
          pubDate: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
          source: 'Financial Express',
        },
        {
          title: 'Auto sector shows strong recovery with record monthly sales',
          link: '#',
          pubDate: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), // 10 hours ago
          source: 'Hindu Business Line',
        },
        {
          title: 'FMCG companies report mixed results amid rural demand concerns',
          link: '#',
          pubDate: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
          source: 'Economic Times',
        },
        {
          title: 'Metals sector gains on China reopening optimism',
          link: '#',
          pubDate: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(), // 14 hours ago
          source: 'Business Standard',
        },
        {
          title: 'Pharma stocks decline on regulatory concerns and pricing pressure',
          link: '#',
          pubDate: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(), // 16 hours ago
          source: 'Mint',
        },
      ];
      
      return newsItems;
    }, 30 * 60 * 1000); // 30 minute cache
  }

  async getStockInfo(symbols: string[]): Promise<StockInfo[]> {
    return this.getCachedData(`stock_info_${symbols.join(',')}`, async () => {
      return symbols.map(symbol => {
        const basePrice = 100 + Math.random() * 900; // 100-1000 range
        const change = (Math.random() - 0.5) * 20; // -10 to +10
        const changePercent = (change / basePrice) * 100;
        
        let bias: 'Bullish' | 'Bearish' | 'Neutral' = 'Neutral';
        if (changePercent > 2) bias = 'Bullish';
        else if (changePercent < -2) bias = 'Bearish';
        
        return {
          symbol,
          name: symbol,
          lastPrice: Math.round(basePrice * 100) / 100,
          change: Math.round(change * 100) / 100,
          changePercent: Math.round(changePercent * 100) / 100,
          bias,
          previousDayRange: {
            high: Math.round((basePrice + 5) * 100) / 100,
            low: Math.round((basePrice - 5) * 100) / 100,
          },
        };
      });
    }, 5 * 60 * 1000); // 5 minute cache
  }

  async isMarketOpen(): Promise<boolean> {
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
    // NSE trading holidays for 2024-2025 (sample, can be extended/updated)
    return [
      // 2024
      '2024-01-26', // Republic Day
      '2024-03-08', // Mahashivratri/Holi (example)
      '2024-03-29', // Good Friday
      '2024-04-11', // Eid ul Fitr
      '2024-04-17', // Ram Navami
      '2024-05-01', // Maharashtra Day
      '2024-06-17', // Eid ul Adha
      '2024-08-15', // Independence Day
      '2024-08-26', // Janmashtami
      '2024-10-02', // Gandhi Jayanti
      '2024-10-12', // Dussehra
      '2024-11-01', // Diwali (example)
      '2024-11-15', // Guru Nanak Jayanti
      '2024-12-25', // Christmas
      // 2025 (illustrative set)
      '2025-01-26', // Republic Day
      '2025-03-14', // Holi (example)
      '2025-04-18', // Good Friday
      '2025-03-31', // Eid ul Fitr (example)
      '2025-04-06', // Ram Navami (example)
      '2025-05-01', // Maharashtra Day
      '2025-06-07', // Eid ul Adha (example)
      '2025-08-15', // Independence Day
      '2025-08-27', // Janmashtami (example)
      '2025-10-02', // Gandhi Jayanti
      '2025-10-01', // Dussehra (example)
      '2025-10-20', // Diwali (example)
      '2025-11-05', // Guru Nanak Jayanti (example)
      '2025-12-25', // Christmas
    ];
  }
}
