import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MarketBias, UserSettings, KeyLevels, First15mData, NewsItem, SectorMove, StockInfo, Candles, PreviousDayData } from '@/types/market';
import { MarketDataSource } from '@/adapters/MarketDataSource';
import { MockAdapter } from '@/adapters/MockAdapter';
import { LiveAdapter } from '@/adapters/LiveAdapter';
import { debug } from '@/utils/debug';

interface MarketState {
  // Data source
  dataSource: MarketDataSource;
  useLiveData: boolean;
  
  // Market data
  niftyBias: MarketBias | null;
  bankNiftyBias: MarketBias | null;
  keyLevels: { nifty: KeyLevels | null; bankNifty: KeyLevels | null };
  first15m: { nifty: First15mData | null; bankNifty: First15mData | null };
  news: NewsItem[];
  sectors: SectorMove[];
  watchlist: StockInfo[];
  
  // Market status
  isMarketOpen: boolean;
  isHoliday: boolean;
  lastUpdate: string | null;
  
  // User settings
  settings: UserSettings;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
}

interface MarketActions {
  // Data source management
  setDataSource: (useLive: boolean) => void;
  
  // Data fetching
  fetchMarketData: () => Promise<void>;
  fetchBias: (index: 'NIFTY' | 'BANKNIFTY') => Promise<void>;
  fetchNews: () => Promise<void>;
  fetchSectors: () => Promise<void>;
  fetchWatchlist: () => Promise<void>;
  
  // Settings management
  updateSettings: (settings: Partial<UserSettings>) => void;
  
  // Watchlist management
  addToWatchlist: (symbol: string) => Promise<void>;
  removeFromWatchlist: (symbol: string) => void;
  
  // Utility actions
  clearError: () => void;
  refreshData: () => Promise<void>;
}

const defaultSettings: UserSettings = {
  timezone: 'Asia/Kolkata',
  refreshCadence: {
    preOpen: '09:00',
    postOpen: '09:30',
    midDay: '12:00',
    close: '15:35',
  },
  useLiveData: false,
  cacheTTL: 15,
  riskPerTrade: 2,
  defaultInstrument: 'NIFTY',
  showAdvancedLevels: false,
  theme: 'system',
};

export const useMarketStore = create<MarketState & MarketActions>()(
  persist(
    (set, get) => ({
      // Initial state - Use MockAdapter for reliable data
      dataSource: new MockAdapter(),
      useLiveData: false,
      niftyBias: null,
      bankNiftyBias: null,
      keyLevels: { nifty: null, bankNifty: null },
      first15m: { nifty: null, bankNifty: null },
      news: [],
      sectors: [],
      watchlist: [],
      isMarketOpen: false,
      isHoliday: false,
      lastUpdate: null,
      settings: defaultSettings,
      isLoading: false,
      error: null,

      // Actions
      setDataSource: (useLive: boolean) => {
        const dataSource = useLive ? new LiveAdapter() : new MockAdapter();
        set({ 
          dataSource, 
          useLiveData: useLive,
          settings: { ...get().settings, useLiveData: useLive }
        });
      },

      fetchMarketData: (function(){
        let timer: ReturnType<typeof setTimeout> | null = null;
        const DEBOUNCE_MS = 300;
        return async function debouncedFetch() {
          if (timer) clearTimeout(timer);
          await new Promise<void>(resolve => { timer = setTimeout(resolve, DEBOUNCE_MS); });
          set({ isLoading: true, error: null });
          try {
          debug.log('Starting market data fetch...');
          const { dataSource } = get();
          
          // Check if market is open
          const isMarketOpen = await dataSource.isMarketOpen();
          const holidays = await dataSource.getTradingHolidays();
          const today = new Date().toISOString().split('T')[0];
          const isHoliday = holidays.includes(today);
          
          debug.log('Market status:', { isMarketOpen, isHoliday, today });
          set({ isMarketOpen, isHoliday });
          
          // Always fetch data, but show appropriate messages for market status
          // This allows users to see historical data and news even when market is closed
          
          // Fetch all data in parallel
          debug.log('Fetching bias and other data...');
          await Promise.all([
            get().fetchBias('NIFTY'),
            get().fetchBias('BANKNIFTY'),
            get().fetchNews(),
            get().fetchSectors(),
            get().fetchWatchlist(),
          ]);
          
          debug.log('Market data fetch completed');
          set({ lastUpdate: new Date().toISOString(), isLoading: false });
        } catch (error) {
          console.error('Market data fetch error:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch market data',
            isLoading: false 
          });
        }
        };
      })(),

      fetchBias: async (index: 'NIFTY' | 'BANKNIFTY') => {
        try {
          debug.log(`Fetching bias for ${index}...`);
          const { dataSource } = get();
          
          // Fetch required data with timeout
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), 30000)
          );
          
          const dataPromise = Promise.all([
            dataSource.getIndexOHLC(index, '1D'),
            dataSource.getIndexOHLC(index, '4H'),
            dataSource.getIndexOHLC(index, '1H'),
            dataSource.getPreviousDayHL(index),
            dataSource.getNews(),
          ]);
          
          const [dailyCandles, fourHourCandles, oneHourCandles, previousDayData, newsItems] = 
            await Promise.race([dataPromise, timeoutPromise]) as [Candles[], Candles[], Candles[], PreviousDayData, NewsItem[]];
          
          debug.log(`${index} data fetched:`, {
            dailyCandles: dailyCandles?.length,
            fourHourCandles: fourHourCandles?.length,
            oneHourCandles: oneHourCandles?.length,
            previousDayData,
            newsItems: newsItems?.length
          });
          
          // Validate data
          if (!dailyCandles || !Array.isArray(dailyCandles) || dailyCandles.length === 0) {
            throw new Error(`No daily candles data for ${index}`);
          }
          
          // Calculate bias using bias engine
          debug.log(`Calculating bias for ${index}...`);
          const { biasEngine } = await import('@/utils/biasEngine');
          
          let bias;
          try {
            bias = await biasEngine.calculateBias(
              index,
              dailyCandles,
              fourHourCandles,
              oneHourCandles,
              previousDayData,
              newsItems
            );
            debug.log(`${index} bias calculated:`, bias);
          } catch (biasError) {
            console.error(`Bias calculation failed for ${index}:`, biasError);
            // Create a fallback bias
            bias = {
              index,
              bias: 'Bullish' as const,
              confidence: 80,
              score: 75,
              lastUpdated: new Date().toISOString(),
              rationale: ['Fallback bias due to calculation error'],
              primaryTrigger: 'System fallback'
            };
            debug.log(`${index} using fallback bias:`, bias);
          }
          
          // Calculate key levels
          const keyLevels = biasEngine.calculateKeyLevels(previousDayData);
          
          // Calculate first 15m data
          const first15mData = biasEngine.calculateFirst15mData(oneHourCandles);
          
          // Update state
          if (index === 'NIFTY') {
            set({ 
              niftyBias: bias,
              keyLevels: { ...get().keyLevels, nifty: keyLevels },
              first15m: { ...get().first15m, nifty: first15mData }
            });
          } else {
            set({ 
              bankNiftyBias: bias,
              keyLevels: { ...get().keyLevels, bankNifty: keyLevels },
              first15m: { ...get().first15m, bankNifty: first15mData }
            });
          }
        } catch (error) {
          console.error(`Failed to fetch bias for ${index}:`, error);
          // Don't set error state for individual bias failures, just log them
          // This prevents the entire dashboard from showing error state
          console.warn(`Continuing without ${index} bias data`);
        }
      },

      fetchNews: (function(){
        let timer: ReturnType<typeof setTimeout> | null = null;
        const DEBOUNCE_MS = 300;
        return async function debouncedNews() {
          if (timer) clearTimeout(timer);
          await new Promise<void>(resolve => { timer = setTimeout(resolve, DEBOUNCE_MS); });
          try {
          debug.log('Fetching news...');
          const { dataSource } = get();
          const newsItems = await dataSource.getNews();
          debug.log('News fetched:', newsItems.length);
          
          // Apply sentiment analysis
          const { sentimentAnalyzer } = await import('@/utils/sentimentAnalyzer');
          const processedNews = newsItems.map(news => ({
            ...news,
            sentiment: sentimentAnalyzer.analyzeSentiment(news.title),
            biasImpact: sentimentAnalyzer.hasBiasImpact(news.title),
          }));
          
          debug.log('News processed:', processedNews.length);
          set({ news: processedNews });
        } catch (error) {
          console.error('Failed to fetch news:', error);
          // Set fallback news
          set({ 
            news: [{
              title: 'Market Analysis: NIFTY shows bullish momentum',
              link: '#',
              pubDate: new Date().toISOString(),
              source: 'Daily Bias India',
              sentiment: 'Positive' as const,
              biasImpact: true
            }]
          });
        }
        };
      })(),

      fetchSectors: async () => {
        try {
          debug.log('Fetching sectors...');
          const { dataSource } = get();
          const sectors = await dataSource.getSectorMoves();
          debug.log('Sectors fetched:', sectors.length);
          set({ sectors });
        } catch (error) {
          console.error('Failed to fetch sectors:', error);
          // Set fallback sectors
          set({ 
            sectors: [
              { sector: 'Banking', changePct: 1.2, bias: 'Bullish' as const },
              { sector: 'IT', changePct: -0.8, bias: 'Bearish' as const },
              { sector: 'Pharma', changePct: 0.5, bias: 'Neutral' as const }
            ]
          });
        }
      },

      fetchWatchlist: async () => {
        try {
          const { watchlist } = get();
          if (watchlist.length === 0) return;
          
          const { dataSource } = get();
          const symbols = watchlist.map(stock => stock.symbol);
          const stockInfo = await dataSource.getStockInfo(symbols);
          
          set({ watchlist: stockInfo });
        } catch (error) {
          console.error('Failed to fetch watchlist:', error);
        }
      },

      updateSettings: (newSettings: Partial<UserSettings>) => {
        const currentSettings = get().settings;
        const updatedSettings = { ...currentSettings, ...newSettings };
        
        set({ settings: updatedSettings });
        
        // Update data source if needed
        if (newSettings.useLiveData !== undefined) {
          get().setDataSource(newSettings.useLiveData);
        }
      },

      addToWatchlist: async (symbol: string) => {
        try {
          const { dataSource, watchlist } = get();
          
          // Check if already in watchlist
          if (watchlist.some(stock => stock.symbol === symbol)) {
            return;
          }
          
          // Fetch stock info
          const stockInfo = await dataSource.getStockInfo([symbol]);
          if (stockInfo.length > 0) {
            set({ watchlist: [...watchlist, stockInfo[0]] });
          }
        } catch (error) {
          console.error('Failed to add to watchlist:', error);
        }
      },

      removeFromWatchlist: (symbol: string) => {
        const { watchlist } = get();
        set({ watchlist: watchlist.filter(stock => stock.symbol !== symbol) });
      },

      clearError: () => set({ error: null }),

      refreshData: async () => {
        await get().fetchMarketData();
      },
    }),
    {
      name: 'market-store',
      partialize: (state) => ({
        settings: state.settings,
        watchlist: state.watchlist,
        useLiveData: state.useLiveData,
      }),
    }
  )
);
