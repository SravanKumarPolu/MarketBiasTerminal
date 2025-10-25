'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SectorMove } from '@/types/market';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SectorHeatmapProps {
  sectors: SectorMove[];
  className?: string;
}

export function SectorHeatmap({ sectors, className }: SectorHeatmapProps) {
  const getChangeColor = (change: number) => {
    if (change > 2) return 'bg-green-600';
    if (change > 1) return 'bg-green-500';
    if (change > 0.5) return 'bg-green-400';
    if (change > 0) return 'bg-green-300';
    if (change > -0.5) return 'bg-gray-300';
    if (change > -1) return 'bg-red-300';
    if (change > -2) return 'bg-red-400';
    return 'bg-red-500';
  };

  const getBiasIcon = (bias?: string) => {
    switch (bias) {
      case 'Bullish':
        return <TrendingUp className="h-3 w-3 text-green-600" />;
      case 'Bearish':
        return <TrendingDown className="h-3 w-3 text-red-600" />;
      default:
        return <Minus className="h-3 w-3 text-gray-600" />;
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

  const formatChange = (change: number) => {
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  // Sort sectors by change percentage
  const sortedSectors = [...sectors].sort((a, b) => b.changePct - a.changePct);

  return (
    <Card className={`w-full card-overflow-safe ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Sector Performance</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 grid-overflow-safe">
          {sortedSectors.map((sector) => (
            <div
              key={sector.sector}
              className="relative group cursor-pointer min-w-0"
            >
              <div className="p-3 rounded-lg border bg-white hover:shadow-md transition-shadow overflow-hidden card-overflow-safe">
                {/* Sector Name */}
                <div className="text-sm font-medium text-gray-800 mb-2 break-words">
                  <div className="line-clamp-2">{sector.sector}</div>
                </div>
                
                {/* Change Percentage */}
                <div className="flex items-center justify-between mb-2">
                  <div className="text-lg font-bold">
                    {formatChange(sector.changePct)}
                  </div>
                  <div className={`w-3 h-3 rounded-full ${getChangeColor(sector.changePct)}`} />
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
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 max-w-48 break-words">
                <div className="line-clamp-2">{sector.sector}: {formatChange(sector.changePct)}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Performance</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded" />
              <span>-2%</span>
              <div className="w-3 h-3 bg-gray-300 rounded" />
              <span>0%</span>
              <div className="w-3 h-3 bg-green-500 rounded" />
              <span>+2%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
