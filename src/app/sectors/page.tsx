'use client';

import { useEffect } from 'react';
import { useMarketStore } from '@/store/marketStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react';

export default function SectorsPage() {
  const {
    sectors,
    isLoading,
    fetchSectors,
  } = useMarketStore();

  useEffect(() => {
    fetchSectors();
  }, [fetchSectors]);

  const getBiasIcon = (bias?: string) => {
    switch (bias) {
      case 'Bullish':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'Bearish':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getBiasColor = (bias?: string) => {
    switch (bias) {
      case 'Bullish':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Bearish':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getChangeColor = (change: number) => {
    if (change > 2) return 'text-green-600';
    if (change > 1) return 'text-green-500';
    if (change > 0.5) return 'text-green-400';
    if (change > 0) return 'text-green-300';
    if (change > -0.5) return 'text-gray-500';
    if (change > -1) return 'text-red-400';
    if (change > -2) return 'text-red-500';
    return 'text-red-600';
  };

  const getBackgroundColor = (change: number) => {
    if (change > 2) return 'bg-green-600';
    if (change > 1) return 'bg-green-500';
    if (change > 0.5) return 'bg-green-400';
    if (change > 0) return 'bg-green-300';
    if (change > -0.5) return 'bg-gray-300';
    if (change > -1) return 'bg-red-300';
    if (change > -2) return 'bg-red-400';
    return 'bg-red-500';
  };

  const formatChange = (change: number) => {
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  // Sort sectors by performance
  const sortedSectors = [...sectors].sort((a, b) => b.changePct - a.changePct);
  
  // Group sectors by bias
  const bullishSectors = sortedSectors.filter(s => s.bias === 'Bullish');
  const bearishSectors = sortedSectors.filter(s => s.bias === 'Bearish');
  const neutralSectors = sortedSectors.filter(s => s.bias === 'Neutral');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Building2 className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sector Analysis</h1>
              <p className="text-gray-600">Performance and bias across Indian market sectors</p>
            </div>
          </div>
          
          <Button
            variant="outline"
            onClick={() => fetchSectors()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span>Bullish Sectors</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{bullishSectors.length}</div>
              <div className="text-sm text-gray-600">sectors showing positive bias</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-600" />
                <span>Bearish Sectors</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{bearishSectors.length}</div>
              <div className="text-sm text-gray-600">sectors showing negative bias</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Minus className="h-5 w-5 text-gray-600" />
                <span>Neutral Sectors</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-600">{neutralSectors.length}</div>
              <div className="text-sm text-gray-600">sectors with mixed signals</div>
            </CardContent>
          </Card>
        </div>

        {/* Sector Heatmap */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Sector Performance Heatmap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {sortedSectors.map((sector) => (
                <div
                  key={sector.sector}
                  className="relative group cursor-pointer"
                >
                  <div className="p-4 rounded-lg border bg-white hover:shadow-md transition-shadow">
                    {/* Sector Name */}
                    <div className="text-sm font-medium text-gray-800 mb-3 truncate">
                      {sector.sector}
                    </div>
                    
                    {/* Performance Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-600">Performance</span>
                        <span className={`text-sm font-bold ${getChangeColor(sector.changePct)}`}>
                          {formatChange(sector.changePct)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getBackgroundColor(sector.changePct)}`}
                          style={{ 
                            width: `${Math.min(100, Math.max(0, (sector.changePct + 5) * 10))}%` 
                          }}
                        />
                      </div>
                    </div>
                    
                    {/* Bias Badge */}
                    {sector.bias && (
                      <div className="flex items-center justify-center">
                        <Badge className={`${getBiasColor(sector.bias)} text-xs px-2 py-1`}>
                          <div className="flex items-center gap-1">
                            {getBiasIcon(sector.bias)}
                            <span>{sector.bias}</span>
                          </div>
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  {/* Hover Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {sector.sector}: {formatChange(sector.changePct)}
                    {sector.bias && ` (${sector.bias})`}
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Performance Scale</span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded" />
                    <span>-5%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gray-300 rounded" />
                    <span>0%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded" />
                    <span>+5%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Sector Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bullish Sectors */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span>Bullish Sectors</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {bullishSectors.map((sector) => (
                <div key={sector.sector} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <div className="font-medium text-green-900">{sector.sector}</div>
                    <div className="text-sm text-green-700">{formatChange(sector.changePct)}</div>
                  </div>
                  <Badge className={getBiasColor(sector.bias)}>
                    <div className="flex items-center gap-1">
                      {getBiasIcon(sector.bias)}
                      <span>{sector.bias}</span>
                    </div>
                  </Badge>
                </div>
              ))}
              {bullishSectors.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  <div className="text-sm">No bullish sectors</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bearish Sectors */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-600" />
                <span>Bearish Sectors</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {bearishSectors.map((sector) => (
                <div key={sector.sector} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <div className="font-medium text-red-900">{sector.sector}</div>
                    <div className="text-sm text-red-700">{formatChange(sector.changePct)}</div>
                  </div>
                  <Badge className={getBiasColor(sector.bias)}>
                    <div className="flex items-center gap-1">
                      {getBiasIcon(sector.bias)}
                      <span>{sector.bias}</span>
                    </div>
                  </Badge>
                </div>
              ))}
              {bearishSectors.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  <div className="text-sm">No bearish sectors</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Neutral Sectors */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Minus className="h-5 w-5 text-gray-600" />
                <span>Neutral Sectors</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {neutralSectors.map((sector) => (
                <div key={sector.sector} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{sector.sector}</div>
                    <div className="text-sm text-gray-700">{formatChange(sector.changePct)}</div>
                  </div>
                  <Badge className={getBiasColor(sector.bias)}>
                    <div className="flex items-center gap-1">
                      {getBiasIcon(sector.bias)}
                      <span>{sector.bias}</span>
                    </div>
                  </Badge>
                </div>
              ))}
              {neutralSectors.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  <div className="text-sm">No neutral sectors</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
