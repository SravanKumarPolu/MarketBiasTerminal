'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  LineChart, 
  Activity,
  Maximize2,
  Minimize2,
  RotateCcw,
  Download,
  Settings,
  Info,
  Target,
  AlertTriangle
} from 'lucide-react';
import { EnhancedChart } from './EnhancedChart';

interface ChartDataPoint {
  timestamp: string;
  value: number;
  label?: string;
  volume?: number;
  change?: number;
}

interface ChartComparisonProps {
  niftyData: ChartDataPoint[];
  bankNiftyData: ChartDataPoint[];
  className?: string;
}

export function ChartComparison({ niftyData, bankNiftyData, className }: ChartComparisonProps) {
  const [viewMode, setViewMode] = useState<'side-by-side' | 'overlay' | 'stacked'>('side-by-side');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1h' | '4h' | '1d' | '1w'>('1d');

  const handleDataPointClick = (point: ChartDataPoint, chartType: string) => {
    console.log(`Clicked ${chartType} point:`, point);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleDownload = () => {
    // Implementation for downloading comparison charts
    console.log('Downloading comparison charts...');
  };

  const getCorrelationAnalysis = () => {
    if (niftyData.length === 0 || bankNiftyData.length === 0) return null;
    
    // Simple correlation calculation
    const niftyValues = niftyData.map(d => d.value);
    const bankNiftyValues = bankNiftyData.map(d => d.value);
    
    const niftyMean = niftyValues.reduce((a, b) => a + b, 0) / niftyValues.length;
    const bankNiftyMean = bankNiftyValues.reduce((a, b) => a + b, 0) / bankNiftyValues.length;
    
    let correlation = 0;
    let niftySum = 0;
    let bankNiftySum = 0;
    let productSum = 0;
    
    for (let i = 0; i < Math.min(niftyValues.length, bankNiftyValues.length); i++) {
      const niftyDiff = niftyValues[i] - niftyMean;
      const bankNiftyDiff = bankNiftyValues[i] - bankNiftyMean;
      
      niftySum += niftyDiff * niftyDiff;
      bankNiftySum += bankNiftyDiff * bankNiftyDiff;
      productSum += niftyDiff * bankNiftyDiff;
    }
    
    correlation = productSum / Math.sqrt(niftySum * bankNiftySum);
    
    return {
      correlation: correlation.toFixed(3),
      strength: Math.abs(correlation) > 0.8 ? 'Strong' : Math.abs(correlation) > 0.5 ? 'Moderate' : 'Weak',
      direction: correlation > 0 ? 'Positive' : 'Negative'
    };
  };

  const correlation = getCorrelationAnalysis();

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-white z-50 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Chart Comparison - Fullscreen</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" onClick={toggleFullscreen}>
              <Minimize2 className="h-4 w-4 mr-2" />
              Exit Fullscreen
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-120px)]">
          <EnhancedChart
            data={niftyData}
            title="NIFTY 50 Performance"
            type="line"
            height={400}
            onDataPointClick={(point) => handleDataPointClick(point, 'NIFTY')}
            showAnalysis={true}
          />
          
          <EnhancedChart
            data={bankNiftyData}
            title="BANK NIFTY Performance"
            type="line"
            height={400}
            onDataPointClick={(point) => handleDataPointClick(point, 'BANKNIFTY')}
            showAnalysis={true}
          />
        </div>
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Market Performance Comparison
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Tabs value={selectedTimeframe} onValueChange={(value) => setSelectedTimeframe(value as '1h' | '4h' | '1d' | '1w')}>
              <TabsList>
                <TabsTrigger value="1h">1H</TabsTrigger>
                <TabsTrigger value="4h">4H</TabsTrigger>
                <TabsTrigger value="1d">1D</TabsTrigger>
                <TabsTrigger value="1w">1W</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button variant="outline" size="sm" onClick={toggleFullscreen}>
              <Maximize2 className="h-4 w-4 mr-2" />
              Fullscreen
            </Button>
          </div>
        </div>
        
        {/* Correlation Analysis */}
        {correlation && (
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="font-medium">Correlation:</span>
              <Badge variant={Math.abs(parseFloat(correlation.correlation)) > 0.7 ? 'default' : 'secondary'}>
                {correlation.correlation}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Strength:</span>
              <Badge variant={correlation.strength === 'Strong' ? 'default' : 'secondary'}>
                {correlation.strength}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Direction:</span>
              <Badge variant={correlation.direction === 'Positive' ? 'default' : 'destructive'}>
                {correlation.direction}
              </Badge>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'side-by-side' | 'overlay' | 'stacked')}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="side-by-side">Side by Side</TabsTrigger>
            <TabsTrigger value="overlay">Overlay</TabsTrigger>
            <TabsTrigger value="stacked">Stacked</TabsTrigger>
          </TabsList>
          
          <TabsContent value="side-by-side" className="mt-4">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <EnhancedChart
                data={niftyData}
                title="NIFTY 50 Performance"
                type="line"
                height={300}
                onDataPointClick={(point) => handleDataPointClick(point, 'NIFTY')}
                showAnalysis={true}
              />
              
              <EnhancedChart
                data={bankNiftyData}
                title="BANK NIFTY Performance"
                type="line"
                height={300}
                onDataPointClick={(point) => handleDataPointClick(point, 'BANKNIFTY')}
                showAnalysis={true}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="overlay" className="mt-4">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Overlay Mode</span>
                </div>
                <p className="text-sm text-blue-700">
                  Both charts are overlaid for direct comparison. Use the chart controls to switch between different visualizations.
                </p>
              </div>
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <EnhancedChart
                  data={niftyData}
                  title="NIFTY 50 (Blue Line)"
                  type="line"
                  height={300}
                  onDataPointClick={(point) => handleDataPointClick(point, 'NIFTY')}
                  showAnalysis={true}
                />
                
                <EnhancedChart
                  data={bankNiftyData}
                  title="BANK NIFTY (Red Line)"
                  type="line"
                  height={300}
                  onDataPointClick={(point) => handleDataPointClick(point, 'BANKNIFTY')}
                  showAnalysis={true}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="stacked" className="mt-4">
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800">Stacked Analysis</span>
                </div>
                <p className="text-sm text-green-700">
                  Charts are stacked vertically for detailed analysis. Perfect for comparing trends and patterns.
                </p>
              </div>
              
              <div className="space-y-4">
                <EnhancedChart
                  data={niftyData}
                  title="NIFTY 50 Performance"
                  type="area"
                  height={250}
                  onDataPointClick={(point) => handleDataPointClick(point, 'NIFTY')}
                  showAnalysis={true}
                />
                
                <EnhancedChart
                  data={bankNiftyData}
                  title="BANK NIFTY Performance"
                  type="area"
                  height={250}
                  onDataPointClick={(point) => handleDataPointClick(point, 'BANKNIFTY')}
                  showAnalysis={true}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
