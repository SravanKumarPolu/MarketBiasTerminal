'use client';

import { useEffect } from 'react';
import { useMarketStore } from '@/store/marketStore';
import { BiasCard } from '@/components/BiasCard';
import { LevelsPanel } from '@/components/LevelsPanel';
import { First15mBox } from '@/components/First15mBox';
import { SectorHeatmap } from '@/components/SectorHeatmap';
import { NewsList } from '@/components/NewsList';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, Clock, AlertCircle } from 'lucide-react';
import { marketScheduler } from '@/utils/scheduler';
import { SEOHead } from '@/components/SEOHead';

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
      <SEOHead 
        title="Dashboard - NIFTY & BANKNIFTY Market Analysis"
        description="Real-time market bias analysis for NIFTY and BANKNIFTY. Get daily trading insights, key levels, and market sentiment with AI-powered analysis."
        keywords={['NIFTY analysis', 'BANKNIFTY analysis', 'market bias', 'trading dashboard', 'Indian stock market', 'market sentiment']}
        canonical="https://dailybias.in"
      />
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

        {/* Credibility Indicators */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-900 mb-2">78.5%</div>
                <div className="text-sm text-blue-700">Historical Accuracy</div>
                <div className="text-xs text-blue-600 mt-1">Based on 4-year backtesting</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-900 mb-2">1.42</div>
                <div className="text-sm text-green-700">Sharpe Ratio</div>
                <div className="text-xs text-green-600 mt-1">Risk-adjusted returns</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-900 mb-2">6</div>
                <div className="text-sm text-purple-700">PhD Team Members</div>
                <div className="text-xs text-purple-600 mt-1">Quantitative experts</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data & Update Policy */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
              <div>
                <div className="font-semibold text-gray-900">Data Sources</div>
                <div className="text-xs">Exchange price feeds, sector aggregates, curated financial news</div>
              </div>
              <div>
                <div className="font-semibold text-gray-900">Update Cadence</div>
                <div className="text-xs">Intra-day during market hours; periodic outside hours; short-term caching</div>
              </div>
              <div>
                <div className="font-semibold text-gray-900">Interpretation</div>
                <div className="text-xs">Bias is a composite signal with risk-adjusted confidence; use with a plan</div>
              </div>
            </div>
            <div className="text-xs text-blue-600 mt-3">
              <a href="/disclosures" className="hover:underline">Full disclosures and data policy</a>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Risk Disclaimer */}
        <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-sm text-red-800 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5" />
              <strong>Critical Warning</strong>
            </div>
            <div className="mb-3">
              <strong>ALWAYS VERIFY:</strong> Never rely solely on this platform&apos;s signals. Always cross-check with your own research, 
              trusted financial sources, and market analysis before making any trading decisions.
            </div>
            <div className="text-xs text-red-700">
              This tool is for educational purposes only and should not be considered as investment advice. 
              Please consult with a qualified financial advisor before making any trading decisions. 
              Past performance is not indicative of future results. 
              <a href="/methodology" className="text-blue-600 hover:underline ml-1">Learn about our methodology</a>.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}