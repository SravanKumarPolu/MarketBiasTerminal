'use client';

import { useEffect } from 'react';
import { useMarketStore } from '@/store/marketStore';
import { BiasCard } from '@/components/BiasCard';
import { LevelsPanel } from '@/components/LevelsPanel';
import { First15mBox } from '@/components/First15mBox';
import { SectorHeatmap } from '@/components/SectorHeatmap';
import { NewsList } from '@/components/NewsList';
import { Button } from '@/components/ui/button';
import { RefreshCw, Clock, AlertCircle } from 'lucide-react';
import { marketScheduler } from '@/utils/scheduler';

export default function Dashboard() {
  const {
    niftyBias,
    bankNiftyBias,
    keyLevels,
    first15m,
    news,
    sectors,
    isMarketOpen,
    isHoliday,
    isLoading,
    error,
    lastUpdate,
    fetchMarketData,
    clearError,
  } = useMarketStore();

  useEffect(() => {
    // Initialize scheduler and fetch initial data
    marketScheduler.start();
    fetchMarketData();
  }, [fetchMarketData]);

  const handleRefresh = async () => {
    await fetchMarketData();
  };

  const formatLastUpdate = (timestamp: string | null) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const marketStatus = marketScheduler.getMarketStatus();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Status Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center space-x-4">
              {/* Market Status */}
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isMarketOpen ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm text-gray-600">{marketStatus.message}</span>
              </div>
              
              {/* Last Update */}
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{formatLastUpdate(lastUpdate)}</span>
              </div>
            </div>
            
            {/* Refresh Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span className="text-red-800">{error}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={clearError}>
                ×
              </Button>
            </div>
          </div>
        )}

        {/* Holiday Banner */}
        {isHoliday && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <span className="text-yellow-800">Market is closed today (Trading Holiday)</span>
            </div>
          </div>
        )}

        {/* Market Closed Banner */}
        {!isMarketOpen && !isHoliday && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="text-blue-800">
                Market is closed. Next open: {marketStatus.nextOpen?.toLocaleString('en-IN', {
                  timeZone: 'Asia/Kolkata',
                  weekday: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Bias Cards and Levels */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bias Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {niftyBias ? (
                <BiasCard bias={niftyBias} />
              ) : (
                <div className="w-full">
                  <div className="bg-white rounded-lg border p-6 text-center text-gray-500">
                    <div className="text-sm">NIFTY Bias - Loading...</div>
                    <div className="text-xs mt-1">Fetching market data</div>
                  </div>
                </div>
              )}
              {bankNiftyBias ? (
                <BiasCard bias={bankNiftyBias} />
              ) : (
                <div className="w-full">
                  <div className="bg-white rounded-lg border p-6 text-center text-gray-500">
                    <div className="text-sm">BANKNIFTY Bias - Loading...</div>
                    <div className="text-xs mt-1">Fetching market data</div>
                  </div>
                </div>
              )}
            </div>

            {/* Levels Panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {keyLevels.nifty ? (
                <LevelsPanel levels={keyLevels.nifty} index="NIFTY" />
              ) : (
                <div className="w-full">
                  <div className="bg-white rounded-lg border p-6 text-center text-gray-500">
                    <div className="text-sm">NIFTY Levels - Loading...</div>
                    <div className="text-xs mt-1">Calculating key levels</div>
                  </div>
                </div>
              )}
              {keyLevels.bankNifty ? (
                <LevelsPanel levels={keyLevels.bankNifty} index="BANKNIFTY" />
              ) : (
                <div className="w-full">
                  <div className="bg-white rounded-lg border p-6 text-center text-gray-500">
                    <div className="text-sm">BANKNIFTY Levels - Loading...</div>
                    <div className="text-xs mt-1">Calculating key levels</div>
                  </div>
                </div>
              )}
            </div>

            {/* First 15m Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <First15mBox data={first15m.nifty} index="NIFTY" />
              <First15mBox data={first15m.bankNifty} index="BANKNIFTY" />
            </div>
          </div>

          {/* Right Column - Sectors and News */}
          <div className="space-y-6">
            {/* Sector Heatmap */}
            <SectorHeatmap sectors={sectors} />
            
            {/* News List */}
            <NewsList news={news} />
          </div>
        </div>

        {/* Risk Disclaimer */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <div className="text-sm text-gray-600 text-center">
            <strong>Disclaimer:</strong> This tool is for educational purposes only and should not be considered as investment advice. 
            Please consult with a qualified financial advisor before making any trading decisions. 
            Past performance is not indicative of future results.
          </div>
        </div>
      </main>
    </div>
  );
}