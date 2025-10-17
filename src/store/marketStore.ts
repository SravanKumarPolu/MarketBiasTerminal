import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MarketBias, UserSettings, KeyLevels, First15mData, NewsItem, SectorMove, StockInfo } from '@/types/market';
import { MarketDataSource } from '@/adapters/MarketDataSource';
import { MockAdapter } from '@/adapters/MockAdapter';
import { LiveAdapter } from '@/adapters/LiveAdapter';

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
      // Initial state
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
          const { dataSource } = get();
          
          // Check if market is open
          const isMarketOpen = await dataSource.isMarketOpen();
          const holidays = await dataSource.getTradingHolidays();
          const today = new Date().toISOString().split('T')[0];
          const isHoliday = holidays.includes(today);
          
          set({ isMarketOpen, isHoliday });
          
          if (!isMarketOpen || isHoliday) {
            set({ isLoading: false });
            return;
          }
          
          // Fetch all data in parallel
          await Promise.all([
            get().fetchBias('NIFTY'),
            get().fetchBias('BANKNIFTY'),
            get().fetchNews(),
            get().fetchSectors(),
            get().fetchWatchlist(),
          ]);
          
          set({ lastUpdate: new Date().toISOString(), isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch market data',
            isLoading: false 
          });
        }
        };
      })(),

      fetchBias: async (index: 'NIFTY' | 'BANKNIFTY') => {
        try {
          const { dataSource } = get();
          
          // Fetch required data
          const [dailyCandles, fourHourCandles, oneHourCandles, previousDayData, newsItems] = await Promise.all([
            dataSource.getIndexOHLC(index, '1D'),
            dataSource.getIndexOHLC(index, '4H'),
            dataSource.getIndexOHLC(index, '1H'),
            dataSource.getPreviousDayHL(index),
            dataSource.getNews(),
          ]);
          
          // Calculate bias using bias engine
          const { biasEngine } = await import('@/utils/biasEngine');
          const bias = await biasEngine.calculateBias(
            index,
            dailyCandles,
            fourHourCandles,
            oneHourCandles,
            previousDayData,
            newsItems
          );
          
          // Calculate key levels
          const keyLevels = biasEngine.calculateKeyLevels(previousDayData);
          
          // Update state
          if (index === 'NIFTY') {
            set({ 
              niftyBias: bias,
              keyLevels: { ...get().keyLevels, nifty: keyLevels }
            });
          } else {
            set({ 
              bankNiftyBias: bias,
              keyLevels: { ...get().keyLevels, bankNifty: keyLevels }
            });
          }
        } catch (error) {
          console.error(`Failed to fetch bias for ${index}:`, error);
        }
      },

      fetchNews: (function(){
        let timer: ReturnType<typeof setTimeout> | null = null;
        const DEBOUNCE_MS = 300;
        return async function debouncedNews() {
          if (timer) clearTimeout(timer);
          await new Promise<void>(resolve => { timer = setTimeout(resolve, DEBOUNCE_MS); });
          try {
          const { dataSource } = get();
          const newsItems = await dataSource.getNews();
          
          // Apply sentiment analysis
          const { sentimentAnalyzer } = await import('@/utils/sentimentAnalyzer');
          const processedNews = newsItems.map(news => ({
            ...news,
            sentiment: sentimentAnalyzer.analyzeSentiment(news.title),
            biasImpact: sentimentAnalyzer.hasBiasImpact(news.title),
          }));
          
          set({ news: processedNews });
        } catch (error) {
          console.error('Failed to fetch news:', error);
        }
        };
      })(),

      fetchSectors: async () => {
        try {
          const { dataSource } = get();
          const sectors = await dataSource.getSectorMoves();
          set({ sectors });
        } catch (error) {
          console.error('Failed to fetch sectors:', error);
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
