'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ResponsiveChartContainer } from '@/components/ResponsiveChartContainer';
import { EnhancedChart } from '@/components/EnhancedChart';
import { ChartComparison } from '@/components/ChartComparison';
import { SectorHeatmap } from '@/components/SectorHeatmap';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';


interface PerformanceMetrics {
  totalReturn: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  beta: number;
  alpha: number;
  rSquared: number;
  trackingError: number;
}

interface SectorData {
  name: string;
  weight: number;
  return: number;
  volatility: number;
  sharpe: number;
  color: string;
}

export function ComprehensiveAnalytics() {
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

  const [performanceMetrics] = useState<PerformanceMetrics>({
    totalReturn: 12.5,
    volatility: 15.2,
    sharpeRatio: 1.8,
    maxDrawdown: -8.3,
    beta: 1.2,
    alpha: 2.1,
    rSquared: 0.85,
    trackingError: 3.2
  });
  const [sectorData] = useState<SectorData[]>([
    { name: 'Financial Services', weight: 32.5, return: 15.2, volatility: 18.3, sharpe: 1.2, color: '#3B82F6' },
    { name: 'Information Technology', weight: 18.7, return: 22.1, volatility: 25.1, sharpe: 1.8, color: '#10B981' },
    { name: 'Energy', weight: 12.3, return: 8.9, volatility: 22.4, sharpe: 0.9, color: '#F59E0B' },
    { name: 'Healthcare', weight: 9.8, return: 11.5, volatility: 16.7, sharpe: 1.4, color: '#EF4444' },
    { name: 'Consumer Goods', weight: 8.2, return: 6.3, volatility: 14.2, sharpe: 0.8, color: '#8B5CF6' },
    { name: 'Others', weight: 18.5, return: 9.7, volatility: 19.8, sharpe: 1.1, color: '#6B7280' }
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const loadData = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  const getPerformanceColor = (value: number, type: 'return' | 'risk' = 'return') => {
    if (type === 'return') {
      return value > 0 ? 'text-green-600' : 'text-red-600';
    } else {
      return value < 10 ? 'text-green-600' : value < 20 ? 'text-yellow-600' : 'text-red-600';
    }
  };

  const getPerformanceIcon = (value: number) => {
    return value > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Return</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(performanceMetrics.totalReturn)}`}>
                  {performanceMetrics.totalReturn > 0 ? '+' : ''}{performanceMetrics.totalReturn}%
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                {getPerformanceIcon(performanceMetrics.totalReturn)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Volatility</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(performanceMetrics.volatility, 'risk')}`}>
                  {performanceMetrics.volatility}%
                </p>
              </div>
              <div className="p-2 bg-orange-100 rounded-full">
                <Activity className="h-4 w-4 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sharpe Ratio</p>
                <p className="text-2xl font-bold text-blue-600">
                  {performanceMetrics.sharpeRatio}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <Target className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Max Drawdown</p>
                <p className="text-2xl font-bold text-red-600">
                  {performanceMetrics.maxDrawdown}%
                </p>
              </div>
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResponsiveChartContainer
          title="NIFTY 50 Performance"
          showControls={true}
          maxHeight={400}
          minHeight={300}
        >
          <EnhancedChart
            data={generateSampleData(18820, 0.015, 50)}
            title="NIFTY 50 Performance"
            type="line"
            height={350}
          />
        </ResponsiveChartContainer>

        <ResponsiveChartContainer
          title="BANK NIFTY Performance"
          showControls={true}
          maxHeight={400}
          minHeight={300}
        >
          <EnhancedChart
            data={generateSampleData(43150, 0.02, 50)}
            title="BANK NIFTY Performance"
            type="line"
            height={350}
          />
        </ResponsiveChartContainer>
      </div>

      {/* Market Comparison */}
      <ResponsiveChartContainer
        title="Market Performance Comparison"
        showControls={true}
        maxHeight={500}
        minHeight={400}
      >
        <ChartComparison 
          niftyData={generateSampleData(18820, 0.015, 50)}
          bankNiftyData={generateSampleData(43150, 0.02, 50)}
        />
      </ResponsiveChartContainer>

      {/* Risk Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Risk Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Beta</span>
              <Badge variant="outline">{performanceMetrics.beta}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Alpha</span>
              <Badge variant="outline" className="text-green-600">
                +{performanceMetrics.alpha}%
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">R²</span>
              <Badge variant="outline">{performanceMetrics.rSquared}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tracking Error</span>
              <Badge variant="outline" className="text-orange-600">
                {performanceMetrics.trackingError}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Market Indicators</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">RSI</span>
              <Badge variant="outline" className="text-orange-600">65.2</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">MACD</span>
              <Badge variant="outline" className="text-green-600">+125.4</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Bollinger Position</span>
              <Badge variant="outline" className="text-blue-600">Upper</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Volume Trend</span>
              <Badge variant="outline" className="text-green-600">Increasing</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Strong positive momentum</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Low volatility environment</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <span className="text-sm">Moderate risk level</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-600" />
              <span className="text-sm">Good risk-adjusted returns</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sector Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResponsiveChartContainer
          title="Sector Performance Heatmap"
          showControls={true}
          maxHeight={400}
          minHeight={300}
        >
          <SectorHeatmap sectors={[]} />
        </ResponsiveChartContainer>

        <ResponsiveChartContainer
          title="Sector Allocation"
          showControls={true}
          maxHeight={400}
          minHeight={300}
        >
          <EnhancedChart
            data={sectorData.map(sector => ({
              timestamp: new Date().toISOString(),
              value: sector.weight,
              label: sector.name
            }))}
            title="Sector Allocation"
            type="bar"
            height={350}
          />
        </ResponsiveChartContainer>
      </div>

      {/* Sector Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sector Analysis Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-medium">Sector</th>
                  <th className="text-right py-3 font-medium">Weight</th>
                  <th className="text-right py-3 font-medium">Return</th>
                  <th className="text-right py-3 font-medium">Volatility</th>
                  <th className="text-right py-3 font-medium">Sharpe</th>
                  <th className="text-center py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {sectorData.map((sector, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 font-medium">{sector.name}</td>
                    <td className="py-3 text-right text-gray-600">{sector.weight}%</td>
                    <td className={`py-3 text-right font-medium ${getPerformanceColor(sector.return)}`}>
                      {sector.return > 0 ? '+' : ''}{sector.return}%
                    </td>
                    <td className="py-3 text-right text-orange-600">{sector.volatility}%</td>
                    <td className="py-3 text-right text-blue-600">{sector.sharpe}</td>
                    <td className="py-3 text-center">
                      <Badge 
                        variant={sector.return > 10 ? "default" : sector.return > 0 ? "secondary" : "destructive"}
                        className="text-xs"
                      >
                        {sector.return > 10 ? 'Strong' : sector.return > 0 ? 'Moderate' : 'Weak'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
