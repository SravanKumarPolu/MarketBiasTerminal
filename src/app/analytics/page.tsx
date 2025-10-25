'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Activity,
  Download,
  RefreshCw,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { ComprehensiveAnalytics } from '@/components/ComprehensiveAnalytics';
import { MobileAnalytics } from '@/components/MobileAnalytics';
import { EnhancedChart } from '@/components/EnhancedChart';
import { ChartComparison } from '@/components/ChartComparison';
import { SectorHeatmap } from '@/components/SectorHeatmap';

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('7d');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area' | 'candlestick'>('line');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Generate sample data for charts
  const generateSampleData = (baseValue: number, volatility: number = 0.02, points: number = 50) => {
    const data = [];
    const now = new Date();
    const startTime = new Date(now.getTime() - (points - 1) * 15 * 60 * 1000); // 15-minute intervals
    
    for (let i = 0; i < points; i++) {
      const timestamp = new Date(startTime.getTime() + i * 15 * 60 * 1000);
      const randomChange = (Math.random() - 0.5) * volatility;
      const value = baseValue * (1 + randomChange + (i * 0.001)); // Slight upward trend
      
      data.push({
        timestamp: timestamp.toISOString(),
        value: Math.round(value * 100) / 100,
        label: `Value ${i + 1}`,
        volume: Math.floor(Math.random() * 1000000) + 500000
      });
    }
    
    return data;
  };

  const niftyData = generateSampleData(18820, 0.015, 50);
  const bankNiftyData = generateSampleData(43150, 0.02, 50);

  const timeRanges = [
    { value: '1h', label: '1 Hour' },
    { value: '4h', label: '4 Hours' },
    { value: '1d', label: '1 Day' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' }
  ];

  const chartTypes = [
    { value: 'line', label: 'Line Chart' },
    { value: 'bar', label: 'Bar Chart' },
    { value: 'area', label: 'Area Chart' },
    { value: 'candlestick', label: 'Candlestick' }
  ];

  return (
    <div className={`min-h-screen bg-gray-50 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <div className="container mx-auto px-4 py-6">
        {/* Mobile Analytics - Hidden on desktop */}
        <div className="block lg:hidden">
          <MobileAnalytics />
        </div>

        {/* Desktop Analytics - Hidden on mobile */}
        <div className="hidden lg:block">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Market Analytics</h1>
            <p className="text-gray-600 mt-2">Comprehensive market analysis and performance metrics</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 mt-4 lg:mt-0">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={chartType} onValueChange={(value) => setChartType(value as 'line' | 'bar' | 'area' | 'candlestick')}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {chartTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </Button>

            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>

            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Main Analytics Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Comparison
            </TabsTrigger>
            <TabsTrigger value="sectors" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Sectors
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <ComprehensiveAnalytics />
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* NIFTY 50 Performance */}
              <Card className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">NIFTY 50 Performance</CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-green-600 font-medium">Max: 18820.00</span>
                      <span className="text-sm text-red-600 font-medium">Min: 18500.00</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-80 w-full">
                    <EnhancedChart
                      data={niftyData}
                      title="NIFTY 50 Performance"
                      type="line"
                      height={320}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* BANK NIFTY Performance */}
              <Card className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">BANK NIFTY Performance</CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-green-600 font-medium">Max: 43150.00</span>
                      <span className="text-sm text-red-600 font-medium">Min: 42000.00</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-80 w-full">
                    <EnhancedChart
                      data={bankNiftyData}
                      title="BANK NIFTY Performance"
                      type="line"
                      height={320}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Market Performance Comparison */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Market Performance Comparison</CardTitle>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Correlation:</span>
                      <span className="text-sm font-medium text-blue-600">0.999</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Strength:</span>
                      <span className="text-sm font-medium text-green-600">Strong</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Direction:</span>
                      <span className="text-sm font-medium text-green-600">Positive</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-96 w-full">
                  <ChartComparison 
                    niftyData={niftyData}
                    bankNiftyData={bankNiftyData}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Comparison Tab */}
          <TabsContent value="comparison" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Return</span>
                    <span className="text-sm font-medium text-green-600">+12.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Volatility</span>
                    <span className="text-sm font-medium text-orange-600">15.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sharpe Ratio</span>
                    <span className="text-sm font-medium text-blue-600">1.8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Max Drawdown</span>
                    <span className="text-sm font-medium text-red-600">-8.3%</span>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Risk Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Beta</span>
                    <span className="text-sm font-medium">1.2</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Alpha</span>
                    <span className="text-sm font-medium text-green-600">+2.1%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">R²</span>
                    <span className="text-sm font-medium">0.85</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tracking Error</span>
                    <span className="text-sm font-medium text-orange-600">3.2%</span>
                  </div>
                </CardContent>
              </Card>

              {/* Market Indicators */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Market Indicators</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">RSI</span>
                    <span className="text-sm font-medium text-orange-600">65.2</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">MACD</span>
                    <span className="text-sm font-medium text-green-600">+125.4</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Bollinger Position</span>
                    <span className="text-sm font-medium text-blue-600">Upper</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Volume Trend</span>
                    <span className="text-sm font-medium text-green-600">Increasing</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Comparison Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Performance Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 w-full">
                  <EnhancedChart
                    data={[]}
                    title="Detailed Performance Comparison"
                    type={chartType}
                    height={384}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sectors Tab */}
          <TabsContent value="sectors" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sector Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Sector Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full">
                    <SectorHeatmap sectors={[]} />
                  </div>
                </CardContent>
              </Card>

              {/* Sector Allocation */}
              <Card>
                <CardHeader>
                  <CardTitle>Sector Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full">
                    <EnhancedChart
                      data={[]}
                      title="Sector Allocation"
                      type="bar"
                      height={320}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sector Details Table */}
            <Card>
              <CardHeader>
                <CardTitle>Sector Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Sector</th>
                        <th className="text-right py-2">Weight</th>
                        <th className="text-right py-2">Return</th>
                        <th className="text-right py-2">Volatility</th>
                        <th className="text-right py-2">Sharpe</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { sector: 'Financial Services', weight: '32.5%', return: '+15.2%', volatility: '18.3%', sharpe: '1.2' },
                        { sector: 'Information Technology', weight: '18.7%', return: '+22.1%', volatility: '25.1%', sharpe: '1.8' },
                        { sector: 'Energy', weight: '12.3%', return: '+8.9%', volatility: '22.4%', sharpe: '0.9' },
                        { sector: 'Healthcare', weight: '9.8%', return: '+11.5%', volatility: '16.7%', sharpe: '1.4' },
                        { sector: 'Consumer Goods', weight: '8.2%', return: '+6.3%', volatility: '14.2%', sharpe: '0.8' },
                        { sector: 'Others', weight: '18.5%', return: '+9.7%', volatility: '19.8%', sharpe: '1.1' }
                      ].map((row, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-2 font-medium">{row.sector}</td>
                          <td className="py-2 text-right text-gray-600">{row.weight}</td>
                          <td className="py-2 text-right text-green-600">{row.return}</td>
                          <td className="py-2 text-right text-orange-600">{row.volatility}</td>
                          <td className="py-2 text-right text-blue-600">{row.sharpe}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </div>
  );
}
