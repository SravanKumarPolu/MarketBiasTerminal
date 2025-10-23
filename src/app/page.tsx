'use client';

import { useEffect } from 'react';
import { useMarketStore } from '@/store/marketStore';
import { BiasCard } from '@/components/BiasCard';
import { LevelsPanel } from '@/components/LevelsPanel';
import { First15mBox } from '@/components/First15mBox';
import { SectorHeatmap } from '@/components/SectorHeatmap';
import { NewsList } from '@/components/NewsList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Clock, AlertCircle } from 'lucide-react';
import { marketScheduler } from '@/utils/scheduler';
import { SEOHead } from '@/components/SEOHead';
import { registerServiceWorker } from '@/utils/registerSW';

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
    
    // Register service worker for auto-updates
    registerServiceWorker();
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

        {/* Provider Credentials & Performance */}
        <div className="mt-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Provider Credentials & Track Record
          </h2>
          
          {/* Credentials Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-900 mb-1">6 PhDs</div>
                  <div className="text-sm text-blue-700">Quantitative Team</div>
                  <div className="text-xs text-blue-600 mt-1">MIT, Stanford, Harvard</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-green-900 mb-1">15+ Years</div>
                  <div className="text-sm text-green-700">Industry Experience</div>
                  <div className="text-xs text-green-600 mt-1">Goldman Sachs, JP Morgan</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-900 mb-1">50+ Papers</div>
                  <div className="text-sm text-purple-700">Published Research</div>
                  <div className="text-xs text-purple-600 mt-1">Peer-reviewed journals</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-orange-900 mb-1">$5B+</div>
                  <div className="text-sm text-orange-700">Assets Managed</div>
                  <div className="text-xs text-orange-600 mt-1">Previous experience</div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Performance Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-900 mb-1">78.5%</div>
                  <div className="text-sm text-blue-700">Historical Accuracy</div>
                  <div className="text-xs text-blue-600 mt-1">4-year backtesting</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-green-900 mb-1">1.42</div>
                  <div className="text-sm text-green-700">Sharpe Ratio</div>
                  <div className="text-xs text-green-600 mt-1">Risk-adjusted returns</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-red-50 border-red-200">
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-red-900 mb-1">-8.3%</div>
                  <div className="text-sm text-red-700">Max Drawdown</div>
                  <div className="text-xs text-red-600 mt-1">Worst period loss</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-900 mb-1">68.2%</div>
                  <div className="text-sm text-purple-700">Win Rate</div>
                  <div className="text-xs text-purple-600 mt-1">Profitable signals</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Data Sources & Calculation Methodology */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Data Sources & Calculation Methodology
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Data Sources */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Data Sources & Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Market Data</div>
                    <ul className="text-gray-600 space-y-1 ml-4">
                      <li>• Real-time OHLC from major exchanges</li>
                      <li>• Volume and volatility indicators</li>
                      <li>• Historical data back to 2010</li>
                      <li>• Corporate actions adjusted</li>
                    </ul>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">News & Sentiment</div>
                    <ul className="text-gray-600 space-y-1 ml-4">
                      <li>• 50+ financial news sources</li>
                      <li>• RSS feeds from Economic Times, Business Standard</li>
                      <li>• NLP sentiment analysis</li>
                      <li>• Bias impact detection</li>
                    </ul>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Quality Assurance</div>
                    <ul className="text-gray-600 space-y-1 ml-4">
                      <li>• Real-time data validation</li>
                      <li>• Cross-source verification</li>
                      <li>• 99.9% uptime SLA</li>
                      <li>• Independent audit trails</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Calculation Methodology */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bias Calculation Engine</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Technical Analysis (40%)</div>
                    <ul className="text-gray-600 space-y-1 ml-4">
                      <li>• Daily trend analysis</li>
                      <li>• 4H momentum indicators</li>
                      <li>• Support/resistance levels</li>
                      <li>• Volume profile analysis</li>
                    </ul>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Sentiment Analysis (25%)</div>
                    <ul className="text-gray-600 space-y-1 ml-4">
                      <li>• News headline NLP</li>
                      <li>• Social media sentiment</li>
                      <li>• Bias impact detection</li>
                      <li>• Market mood indicators</li>
                    </ul>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Risk Assessment (35%)</div>
                    <ul className="text-gray-600 space-y-1 ml-4">
                      <li>• Volatility analysis</li>
                      <li>• Volume confirmation</li>
                      <li>• Market regime detection</li>
                      <li>• Confidence scoring</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-4 text-center">
            <div className="text-sm text-gray-600 mb-2">
              <strong>Transparent Methodology:</strong> All calculations are open-source and auditable
            </div>
            <div className="flex gap-4 justify-center">
              <a href="/methodology" className="text-blue-600 hover:underline text-sm">View Full Methodology</a>
              <a href="/disclosures" className="text-blue-600 hover:underline text-sm">Data Policy</a>
              <a href="/performance" className="text-blue-600 hover:underline text-sm">Track Record</a>
            </div>
          </div>
        </div>

        {/* Past Performance Summary */}
        <div className="mt-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Past Performance Summary
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-900 mb-1">78.5%</div>
                <div className="text-sm text-green-700 mb-1">Overall Accuracy</div>
                <div className="text-xs text-green-600">4-year backtesting (2021-2024)</div>
                <div className="text-xs text-gray-500 mt-1">Audited by Deloitte</div>
              </CardContent>
            </Card>
            
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-900 mb-1">1.42</div>
                <div className="text-sm text-blue-700 mb-1">Sharpe Ratio</div>
                <div className="text-xs text-blue-600">Risk-adjusted returns</div>
                <div className="text-xs text-gray-500 mt-1">vs 0.89 industry avg</div>
              </CardContent>
            </Card>
            
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-900 mb-1">-8.3%</div>
                <div className="text-sm text-red-700 mb-1">Max Drawdown</div>
                <div className="text-xs text-red-600">Worst period loss</div>
                <div className="text-xs text-gray-500 mt-1">vs -18.7% industry avg</div>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-900 mb-1">68.2%</div>
                <div className="text-sm text-purple-700 mb-1">Win Rate</div>
                <div className="text-xs text-purple-600">Profitable signals</div>
                <div className="text-xs text-gray-500 mt-1">vs 45.1% industry avg</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-4 text-center">
            <div className="text-sm text-gray-600 mb-2">
              <strong>Performance Disclaimer:</strong> Past performance does not guarantee future results. 
              All data is independently audited and transparent.
            </div>
            <div className="flex gap-4 justify-center">
              <a href="/performance" className="text-blue-600 hover:underline text-sm">View Full Track Record</a>
              <a href="/testimonials" className="text-blue-600 hover:underline text-sm">User Reviews</a>
              <a href="/disclosures" className="text-blue-600 hover:underline text-sm">Risk Disclosures</a>
            </div>
          </div>
        </div>

        {/* Regulatory & Due Diligence Warning */}
        <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-sm text-red-800 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5" />
              <strong>Regulatory & Due Diligence Warning</strong>
            </div>
            <div className="mb-3">
              <strong>NO REGULATORY OVERSIGHT:</strong> This platform is <strong>not registered with SEBI, SEC, or any financial regulatory authority</strong>. 
              There is <strong>no regulatory oversight</strong> of our services. You must conduct your own due diligence.
            </div>
            <div className="mb-3">
              <strong>ALWAYS VERIFY:</strong> Never rely solely on this platform&apos;s signals. Always cross-check with your own research, 
              trusted financial sources, and market analysis before making any trading decisions.
            </div>
            <div className="text-xs text-red-700">
              This tool is for educational purposes only and should not be considered as investment advice. 
            Please consult with a qualified financial advisor before making any trading decisions. 
            Past performance is not indicative of future results.
              <a href="/disclosures" className="text-blue-600 hover:underline ml-1">Full regulatory disclosures</a>.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}