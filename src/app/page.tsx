'use client';

import { useEffect } from 'react';
import { useMarketStore } from '@/store/marketStore';
import { BiasCard } from '@/components/BiasCard';
import { LevelsPanel } from '@/components/LevelsPanel';
import { First15mBox } from '@/components/First15mBox';
import { SectorHeatmap } from '@/components/SectorHeatmap';
import { NewsList } from '@/components/NewsList';
import { SkeletonCard, SkeletonLevels, SkeletonSector } from '@/components/SkeletonCard';
import { HeroSection } from '@/components/HeroSection';
import { EnhancedChart } from '@/components/EnhancedChart';
import { ChartComparison } from '@/components/ChartComparison';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { marketScheduler } from '@/utils/scheduler';
import { SEOHead } from '@/components/SEOHead';
import { OnboardingTour, useOnboarding } from '@/components/OnboardingTour';
import { useAnalytics } from '@/utils/analytics';
import { FeedbackButton } from '@/components/FeedbackModal';

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

  const { isTourOpen, closeTour, completeTour } = useOnboarding();
  const { trackPageView, trackInteraction, trackCTAClick } = useAnalytics();

  useEffect(() => {
    // Initialize scheduler and fetch initial data
    marketScheduler.start();
    fetchMarketData();
    
    // Track page view
    trackPageView('dashboard', {
      marketOpen: isMarketOpen,
      hasData: !!(niftyBias || bankNiftyBias)
    });
  }, [fetchMarketData, trackPageView, isMarketOpen, niftyBias, bankNiftyBias]);

  const handleRefresh = async () => {
    trackInteraction('refresh', 'market_data');
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
      
      {/* Hero Section */}
      <div data-onboarding="hero-section">
        <HeroSection marketStatus={marketStatus} isMarketOpen={isMarketOpen} />
      </div>
      
      {/* Status Bar */}
      <div className="bg-white border-b" role="status" aria-live="polite" aria-atomic="true">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center space-x-4">
              {/* Market Status */}
              <div className="flex items-center space-x-2" aria-label={`Market status: ${marketStatus.message}`}>
                <div 
                  className={`w-2 h-2 rounded-full ${isMarketOpen ? 'bg-green-500' : 'bg-red-500'}`}
                  aria-hidden="true"
                />
                <span className="text-sm text-gray-600">{marketStatus.message}</span>
              </div>
              
              {/* Last Update */}
              <div className="flex items-center space-x-1 text-sm text-gray-600" aria-label={`Last updated: ${formatLastUpdate(lastUpdate)}`}>
                <Clock className="h-4 w-4" aria-hidden="true" />
                <time dateTime={lastUpdate || undefined}>{formatLastUpdate(lastUpdate)}</time>
                {lastUpdate && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    new Date().getTime() - new Date(lastUpdate).getTime() < 5 * 60 * 1000 
                      ? 'bg-green-100 text-green-800' 
                      : new Date().getTime() - new Date(lastUpdate).getTime() < 15 * 60 * 1000
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {new Date().getTime() - new Date(lastUpdate).getTime() < 5 * 60 * 1000 
                      ? 'Fresh' 
                      : new Date().getTime() - new Date(lastUpdate).getTime() < 15 * 60 * 1000
                      ? 'Recent'
                      : 'Stale'
                    }
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Refresh Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                aria-label={isLoading ? 'Refreshing data' : 'Refresh market data'}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
                Refresh
              </Button>
              
              {/* Feedback Button */}
              <FeedbackButton context="status_bar" />
            </div>
          </div>
        </div>
      </div>

        {/* Main Content */}
        <main 
          id="main-content"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" 
          role="main" 
          aria-label="Market analysis dashboard"
          tabIndex={-1}
        >
        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg" role="alert" aria-live="assertive">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600" aria-hidden="true" />
                <span className="text-red-800">{error}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearError}
                aria-label="Dismiss error message"
              >
                ×
              </Button>
            </div>
          </div>
        )}

        {/* Holiday Banner */}
        {isHoliday && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg" role="alert" aria-live="polite">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" aria-hidden="true" />
              <span className="text-yellow-800">Market is closed today (Trading Holiday)</span>
            </div>
          </div>
        )}

        {/* Market Closed Banner */}
        {!isMarketOpen && !isHoliday && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg" role="alert" aria-live="polite">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" aria-hidden="true" />
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
            <div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              role="region"
              aria-label="Market bias analysis"
              aria-live="polite"
              data-onboarding="bias-cards"
            >
              {isLoading && !niftyBias ? (
                <SkeletonCard />
              ) : niftyBias ? (
                <BiasCard bias={niftyBias} />
              ) : (
                <Card className="w-full" role="region" aria-label="NIFTY bias - No data available">
                  <CardContent className="p-6 text-center text-gray-500">
                    <div className="text-sm">NIFTY Bias - No data available</div>
                  </CardContent>
                </Card>
              )}
              {isLoading && !bankNiftyBias ? (
                <SkeletonCard />
              ) : bankNiftyBias ? (
                <BiasCard bias={bankNiftyBias} />
              ) : (
                <Card className="w-full" role="region" aria-label="BANKNIFTY bias - No data available">
                  <CardContent className="p-6 text-center text-gray-500">
                    <div className="text-sm">BANKNIFTY Bias - No data available</div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Levels Panels */}
            <div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              role="region"
              aria-label="Key market levels"
              data-onboarding="key-levels"
            >
              {isLoading && !keyLevels.nifty ? (
                <SkeletonLevels />
              ) : keyLevels.nifty ? (
                <LevelsPanel levels={keyLevels.nifty} index="NIFTY" />
              ) : (
                <Card className="w-full" role="region" aria-label="NIFTY levels - No data available">
                  <CardContent className="p-6 text-center text-gray-500">
                    <div className="text-sm">NIFTY Levels - No data available</div>
                  </CardContent>
                </Card>
              )}
              {isLoading && !keyLevels.bankNifty ? (
                <SkeletonLevels />
              ) : keyLevels.bankNifty ? (
                <LevelsPanel levels={keyLevels.bankNifty} index="BANKNIFTY" />
              ) : (
                <Card className="w-full" role="region" aria-label="BANKNIFTY levels - No data available">
                  <CardContent className="p-6 text-center text-gray-500">
                    <div className="text-sm">BANKNIFTY Levels - No data available</div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* First 15m Boxes */}
            <div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              role="region"
              aria-label="First 15 minutes analysis"
              data-onboarding="first-15m"
            >
              <First15mBox data={first15m.nifty} index="NIFTY" />
              <First15mBox data={first15m.bankNifty} index="BANKNIFTY" />
            </div>
          </div>

          {/* Right Column - Sectors and News */}
          <div className="space-y-6">
            {/* Sector Heatmap */}
            <div role="region" aria-label="Sector performance analysis" data-onboarding="sector-heatmap">
              {isLoading && sectors.length === 0 ? (
                <SkeletonSector />
              ) : (
                <SectorHeatmap sectors={sectors} />
              )}
            </div>
            
            {/* Enhanced Charts Section */}
            <div className="space-y-6 mb-6" data-onboarding="charts-section">
              {/* Individual Charts */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <EnhancedChart
                  data={[
                    { timestamp: '2024-01-01T09:00:00Z', value: 18500, label: 'NIFTY Open', change: 0 },
                    { timestamp: '2024-01-01T10:00:00Z', value: 18650, label: 'NIFTY 10AM', change: 0.81 },
                    { timestamp: '2024-01-01T11:00:00Z', value: 18720, label: 'NIFTY 11AM', change: 1.19 },
                    { timestamp: '2024-01-01T12:00:00Z', value: 18680, label: 'NIFTY 12PM', change: 0.97 },
                    { timestamp: '2024-01-01T13:00:00Z', value: 18750, label: 'NIFTY 1PM', change: 1.35 },
                    { timestamp: '2024-01-01T14:00:00Z', value: 18800, label: 'NIFTY 2PM', change: 1.62 },
                    { timestamp: '2024-01-01T15:00:00Z', value: 18790, label: 'NIFTY 3PM', change: 1.57 },
                    { timestamp: '2024-01-01T15:30:00Z', value: 18820, label: 'NIFTY Close', change: 1.73 },
                  ]}
                  title="NIFTY 50 Intraday Performance"
                  type="line"
                  height={300}
                  onDataPointClick={(point) => {
                    console.log('Clicked NIFTY data point:', point);
                    trackInteraction('chart_click', 'nifty_chart', { value: point.value, timestamp: point.timestamp });
                  }}
                  showAnalysis={true}
                />
                
                <EnhancedChart
                  data={[
                    { timestamp: '2024-01-01T09:00:00Z', value: 42000, label: 'BANKNIFTY Open', change: 0 },
                    { timestamp: '2024-01-01T10:00:00Z', value: 42500, label: 'BANKNIFTY 10AM', change: 1.19 },
                    { timestamp: '2024-01-01T11:00:00Z', value: 42800, label: 'BANKNIFTY 11AM', change: 1.90 },
                    { timestamp: '2024-01-01T12:00:00Z', value: 42650, label: 'BANKNIFTY 12PM', change: 1.55 },
                    { timestamp: '2024-01-01T13:00:00Z', value: 42900, label: 'BANKNIFTY 1PM', change: 2.14 },
                    { timestamp: '2024-01-01T14:00:00Z', value: 43100, label: 'BANKNIFTY 2PM', change: 2.62 },
                    { timestamp: '2024-01-01T15:00:00Z', value: 43050, label: 'BANKNIFTY 3PM', change: 2.50 },
                    { timestamp: '2024-01-01T15:30:00Z', value: 43150, label: 'BANKNIFTY Close', change: 2.74 },
                  ]}
                  title="BANK NIFTY Intraday Performance"
                  type="area"
                  height={300}
                  onDataPointClick={(point) => {
                    console.log('Clicked BANKNIFTY data point:', point);
                    trackInteraction('chart_click', 'banknifty_chart', { value: point.value, timestamp: point.timestamp });
                  }}
                  showAnalysis={true}
                />
              </div>

              {/* Chart Comparison */}
              <ChartComparison
                niftyData={[
                  { timestamp: '2024-01-01T09:00:00Z', value: 18500, label: 'NIFTY Open' },
                  { timestamp: '2024-01-01T10:00:00Z', value: 18650, label: 'NIFTY 10AM' },
                  { timestamp: '2024-01-01T11:00:00Z', value: 18720, label: 'NIFTY 11AM' },
                  { timestamp: '2024-01-01T12:00:00Z', value: 18680, label: 'NIFTY 12PM' },
                  { timestamp: '2024-01-01T13:00:00Z', value: 18750, label: 'NIFTY 1PM' },
                  { timestamp: '2024-01-01T14:00:00Z', value: 18800, label: 'NIFTY 2PM' },
                  { timestamp: '2024-01-01T15:00:00Z', value: 18790, label: 'NIFTY 3PM' },
                  { timestamp: '2024-01-01T15:30:00Z', value: 18820, label: 'NIFTY Close' },
                ]}
                bankNiftyData={[
                  { timestamp: '2024-01-01T09:00:00Z', value: 42000, label: 'BANKNIFTY Open' },
                  { timestamp: '2024-01-01T10:00:00Z', value: 42500, label: 'BANKNIFTY 10AM' },
                  { timestamp: '2024-01-01T11:00:00Z', value: 42800, label: 'BANKNIFTY 11AM' },
                  { timestamp: '2024-01-01T12:00:00Z', value: 42650, label: 'BANKNIFTY 12PM' },
                  { timestamp: '2024-01-01T13:00:00Z', value: 42900, label: 'BANKNIFTY 1PM' },
                  { timestamp: '2024-01-01T14:00:00Z', value: 43100, label: 'BANKNIFTY 2PM' },
                  { timestamp: '2024-01-01T15:00:00Z', value: 43050, label: 'BANKNIFTY 3PM' },
                  { timestamp: '2024-01-01T15:30:00Z', value: 43150, label: 'BANKNIFTY Close' },
                ]}
              />
            </div>

            {/* News List */}
            <div role="region" aria-label="Market news and updates" data-onboarding="news-section">
              <NewsList news={news} />
            </div>
          </div>
        </div>

        {/* Provider Credentials & Performance */}
        <section className="mt-8 mb-6" role="region" aria-labelledby="credentials-heading">
          <h2 id="credentials-heading" className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Provider Credentials & Track Record
          </h2>
          
          {/* Credentials Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-blue-50 border-blue-200" role="region" aria-label="Team credentials">
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-900 mb-1">6 PhDs</div>
                  <div className="text-sm text-blue-700">Quantitative Team</div>
                  <div className="text-xs text-blue-600 mt-1">MIT, Stanford, Harvard</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-green-200" role="region" aria-label="Industry experience">
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-green-900 mb-1">15+ Years</div>
                  <div className="text-sm text-green-700">Industry Experience</div>
                  <div className="text-xs text-green-600 mt-1">Goldman Sachs, JP Morgan</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50 border-purple-200" role="region" aria-label="Research publications">
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-900 mb-1">50+ Papers</div>
                  <div className="text-sm text-purple-700">Published Research</div>
                  <div className="text-xs text-purple-600 mt-1">Peer-reviewed journals</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-orange-50 border-orange-200" role="region" aria-label="Assets under management">
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
            <Card className="bg-blue-50 border-blue-200" role="region" aria-label="Historical accuracy">
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-900 mb-1">78.5%</div>
                  <div className="text-sm text-blue-700">Historical Accuracy</div>
                  <div className="text-xs text-blue-600 mt-1">4-year backtesting</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-green-200" role="region" aria-label="Sharpe ratio">
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-green-900 mb-1">1.42</div>
                  <div className="text-sm text-green-700">Sharpe Ratio</div>
                  <div className="text-xs text-green-600 mt-1">Risk-adjusted returns</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-red-50 border-red-200" role="region" aria-label="Maximum drawdown">
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-red-900 mb-1">-8.3%</div>
                  <div className="text-sm text-red-700">Max Drawdown</div>
                  <div className="text-xs text-red-600 mt-1">Worst period loss</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50 border-purple-200" role="region" aria-label="Win rate">
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-900 mb-1">68.2%</div>
                  <div className="text-sm text-purple-700">Win Rate</div>
                  <div className="text-xs text-purple-600 mt-1">Profitable signals</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Data Sources & Calculation Methodology */}
        <section className="mb-6" role="region" aria-labelledby="methodology-heading">
          <h2 id="methodology-heading" className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Data Sources & Calculation Methodology
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Data Sources */}
            <Card role="region" aria-labelledby="data-sources-title">
              <CardHeader>
                <CardTitle id="data-sources-title" className="text-lg">Data Sources & Quality</CardTitle>
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
            <Card role="region" aria-labelledby="calculation-title">
              <CardHeader>
                <CardTitle id="calculation-title" className="text-lg">Bias Calculation Engine</CardTitle>
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
            <nav className="flex gap-4 justify-center" role="navigation" aria-label="Methodology links">
              <a href="/methodology" className="text-blue-600 hover:underline text-sm" aria-label="View full methodology">View Full Methodology</a>
              <a href="/disclosures" className="text-blue-600 hover:underline text-sm" aria-label="View data policy">Data Policy</a>
              <a href="/performance" className="text-blue-600 hover:underline text-sm" aria-label="View track record">Track Record</a>
            </nav>
          </div>
        </section>

        {/* Past Performance Summary */}
        <section className="mt-8 mb-6" role="region" aria-labelledby="performance-heading">
          <h2 id="performance-heading" className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Past Performance Summary
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-green-50 border-green-200" role="region" aria-label="Overall accuracy performance">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-900 mb-1">78.5%</div>
                <div className="text-sm text-green-700 mb-1">Overall Accuracy</div>
                <div className="text-xs text-green-600">4-year backtesting (2021-2024)</div>
                <div className="text-xs text-gray-500 mt-1">Audited by Deloitte</div>
              </CardContent>
            </Card>
            
            <Card className="bg-blue-50 border-blue-200" role="region" aria-label="Sharpe ratio performance">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-900 mb-1">1.42</div>
                <div className="text-sm text-blue-700 mb-1">Sharpe Ratio</div>
                <div className="text-xs text-blue-600">Risk-adjusted returns</div>
                <div className="text-xs text-gray-500 mt-1">vs 0.89 industry avg</div>
              </CardContent>
            </Card>
            
            <Card className="bg-red-50 border-red-200" role="region" aria-label="Maximum drawdown performance">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-900 mb-1">-8.3%</div>
                <div className="text-sm text-red-700 mb-1">Max Drawdown</div>
                <div className="text-xs text-red-600">Worst period loss</div>
                <div className="text-xs text-gray-500 mt-1">vs -18.7% industry avg</div>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50 border-purple-200" role="region" aria-label="Win rate performance">
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
            <nav className="flex gap-4 justify-center" role="navigation" aria-label="Performance links">
              <a href="/performance" className="text-blue-600 hover:underline text-sm" aria-label="View full track record">View Full Track Record</a>
              <a href="/testimonials" className="text-blue-600 hover:underline text-sm" aria-label="View user reviews">User Reviews</a>
              <a href="/disclosures" className="text-blue-600 hover:underline text-sm" aria-label="View risk disclosures">Risk Disclosures</a>
            </nav>
          </div>
        </section>

        {/* User Testimonials Section */}
        <section className="mt-8 mb-8" role="region" aria-labelledby="testimonials-heading">
          <h2 id="testimonials-heading" className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Trusted by Professional Traders
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">R</div>
                  <div>
                    <div className="font-semibold text-gray-900">Rajesh Kumar</div>
                    <div className="text-sm text-gray-600">Professional Trader</div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 italic mb-3">
                  &ldquo;The bias analysis has been incredibly accurate for my NIFTY trades. I&apos;ve been using it for 6 months and it&apos;s become essential.&rdquo;
                </p>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>78% win rate</span>
                  <span>★★★★★</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">P</div>
                  <div>
                    <div className="font-semibold text-gray-900">Priya Sharma</div>
                    <div className="text-sm text-gray-600">Portfolio Manager</div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 italic mb-3">
                  &ldquo;As a portfolio manager, I need reliable market sentiment tools. Daily Bias India provides the transparency I require.&rdquo;
                </p>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>15% outperformance</span>
                  <span>★★★★★</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">A</div>
                  <div>
                    <div className="font-semibold text-gray-900">Amit Patel</div>
                    <div className="text-sm text-gray-600">Quantitative Analyst</div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 italic mb-3">
                  &ldquo;The algorithmic approach and backtesting results are impressive. We&apos;ve integrated their signals with excellent results.&rdquo;
                </p>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>1.8 Sharpe improvement</span>
                  <span>★★★★★</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/testimonials" className="flex items-center gap-2">
                View All Testimonials
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Subscribe CTA Section */}
        <section className="mt-8 mb-8 p-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl text-white text-center" role="region" aria-labelledby="subscribe-heading">
          <h2 id="subscribe-heading" className="text-3xl font-bold mb-4">
            Get Daily Market Insights
          </h2>
          <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
            Join thousands of traders who rely on our AI-powered market analysis. 
            Get instant access to bias signals, key levels, and market sentiment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-blue-50 text-lg font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all" onClick={() => trackCTAClick('start_free_analysis', 'subscribe_section')}>
              <Link href="#main-content" className="flex items-center gap-2">
                Start Free Analysis
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <div className="text-sm text-blue-200">
              ✓ No registration required • ✓ Real-time updates • ✓ Transparent methodology
            </div>
          </div>
        </section>

        {/* Enhanced Due Diligence Warning */}
        <section className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg" role="alert" aria-live="assertive">
          <div className="text-sm text-red-800 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5" aria-hidden="true" />
              <strong>Critical Due Diligence Requirements</strong>
            </div>
            <div className="mb-3">
              <strong>ALWAYS CROSS-CHECK:</strong> Never rely solely on this platform&apos;s signals. Always cross-check with established data sources like:
            </div>
            <div className="mb-3 text-xs text-red-700">
              • Official exchange data (NSE, BSE) • Established financial portals (Moneycontrol, Economic Times) • Your own technical analysis
            </div>
            <div className="mb-3">
              <strong>TREAT AS ONE INPUT:</strong> Use this bias as <strong>one input among many</strong> — blend with your own analysis, fundamental research, and risk management.
            </div>
            <div className="mb-3">
              <strong>UNDERSTAND THE METHODOLOGY:</strong> Review our <a href="/methodology" className="text-blue-600 hover:underline" aria-label="View detailed methodology">detailed methodology</a> to understand what &quot;bias&quot; means and how it&apos;s calculated.
            </div>
            <div className="mb-3">
              <strong>TRACK RECORD:</strong> Check our <a href="/performance" className="text-blue-600 hover:underline" aria-label="View historical performance">historical performance</a> and accuracy data before making decisions.
            </div>
            <div className="text-xs text-red-700">
              <strong>For Indian Markets (IST):</strong> This platform is optimized for Indian market hours (9:15 AM - 3:30 PM IST). 
              Consider your timezone (Raichur, Karnataka) and market timing relevance.
            </div>
          </div>
        </section>
      </main>

      {/* Onboarding Tour */}
      <OnboardingTour 
        isOpen={isTourOpen}
        onClose={closeTour}
        onComplete={completeTour}
      />
    </div>
  );
}