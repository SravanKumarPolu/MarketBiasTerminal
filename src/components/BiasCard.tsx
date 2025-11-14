'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MarketBias } from '@/types/market';
import { TrendingUp, TrendingDown, Minus, Clock, AlertTriangle } from 'lucide-react';

interface BiasCardProps {
  bias: MarketBias;
  className?: string;
}

export function BiasCard({ bias, className }: BiasCardProps) {
  // Validate bias data
  if (!bias || typeof bias !== 'object') {
    return (
      <Card className={`w-full ${className}`}>
        <CardContent className="p-6 text-center text-gray-500">
          <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
          <p>Invalid bias data</p>
        </CardContent>
      </Card>
    );
  }

  const getBiasIcon = (biasType: string) => {
    switch (biasType) {
      case 'Bullish':
        return <TrendingUp className="h-6 w-6 text-green-600" />;
      case 'Bearish':
        return <TrendingDown className="h-6 w-6 text-red-600" />;
      default:
        return <Minus className="h-6 w-6 text-gray-600" />;
    }
  };

  const getBiasColor = (biasType: string) => {
    switch (biasType) {
      case 'Bullish':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Bearish':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    try {
      if (isNaN(confidence) || !isFinite(confidence)) {
        return 'bg-gray-500';
      }
      if (confidence >= 70) return 'bg-green-500';
      if (confidence >= 40) return 'bg-yellow-500';
      return 'bg-red-500';
    } catch (error) {
      console.error('Error getting confidence color:', error);
      return 'bg-gray-500';
    }
  };

  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return 'Invalid time';
      }
      return date.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Invalid time';
    }
  };

  return (
    <Card 
      className={`w-full hover:shadow-lg transition-shadow duration-300 card-overflow-safe ${className}`} 
      role="region" 
      aria-label={`${bias.index} market bias analysis`}
    >
      <CardHeader className="pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between min-w-0 overflow-hidden">
          <CardTitle className="text-lg font-semibold flex items-center gap-2 min-w-0 flex-1">
            <div className="p-1.5 rounded-lg bg-blue-50 flex-shrink-0">
              {getBiasIcon(bias.bias)}
            </div>
            <span className="truncate">{bias.index}</span>
          </CardTitle>
          <div className="flex items-center gap-2 flex-shrink-0" role="status" aria-label={`Bias: ${bias.bias}`}>
            <Badge className={`${getBiasColor(bias.bias)} font-medium text-sm px-3 py-1 flex-shrink-0`}>
              <span className="truncate">{bias.bias}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Score and Confidence - Enhanced Visual Design */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold text-gray-900" aria-label={`Bias score: ${bias.score}`}>
                {isNaN(bias.score) || !isFinite(bias.score) ? '0' : (bias.score > 0 ? '+' : '') + bias.score}
              </div>
              <span className="text-sm font-medium text-gray-600">points</span>
            </div>
            <div className="text-sm font-medium text-gray-700">Bias Score</div>
          </div>
          
          <div className="text-center space-y-2">
            <div 
              className="text-2xl font-bold text-blue-700" 
              aria-label={`Confidence level: ${bias.confidence}%`}
            >
              {isNaN(bias.confidence) || !isFinite(bias.confidence) ? '0' : bias.confidence}%
            </div>
            <div className="text-sm font-medium text-gray-700">Confidence</div>
          </div>
        </div>

        {/* Confidence Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-600">
            <span>0%</span>
            <span>100%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2" role="progressbar" aria-valuenow={bias.confidence} aria-valuemin={0} aria-valuemax={100} aria-label={`Confidence level: ${bias.confidence}%`}>
            <div 
              className={`h-2 rounded-full ${getConfidenceColor(bias.confidence)} transition-all duration-300`}
              style={{ width: `${Math.min(100, Math.max(0, isNaN(bias.confidence) || !isFinite(bias.confidence) ? 0 : bias.confidence))}%` }}
            />
          </div>
        </div>

        {/* Rationale */}
        {bias.rationale.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">Why {bias.bias}?</div>
            <div className="space-y-1">
              {bias.rationale.slice(0, 3).map((reason, index) => (
                <div key={index} className="text-xs text-gray-600 bg-gray-50 p-2 rounded break-words overflow-hidden">
                  <div className="line-clamp-2">{reason}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Methodology Breakdown */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-sm font-medium text-blue-900 mb-2">Calculation Methodology</div>
          <div className="grid grid-cols-3 gap-2 text-xs text-blue-800">
            <div className="text-center">
              <div className="font-semibold">Technical (40%)</div>
              <div className="text-blue-600">Trend & Momentum</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">Sentiment (25%)</div>
              <div className="text-blue-600">News & Social</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">Risk (35%)</div>
              <div className="text-blue-600">Volatility & Volume</div>
            </div>
          </div>
          <div className="text-xs text-blue-700 mt-2 text-center">
            <a href="/methodology" className="hover:underline">View detailed methodology</a>
          </div>
        </div>

        {/* Key Info */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          {bias.invalidationLevel && (
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-gray-600">
                <AlertTriangle className="h-3 w-3" />
                <span>Invalidation</span>
              </div>
              <div className="font-medium">{bias.invalidationLevel}</div>
            </div>
          )}
          
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-gray-600">
              <Clock className="h-3 w-3" />
              <span>Updated</span>
            </div>
            <div className="font-medium">{formatTime(bias.lastUpdated)}</div>
          </div>
        </div>

        {/* Primary Trigger */}
        {bias.primaryTrigger && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm font-medium text-blue-900 mb-1">Primary Trigger</div>
            <div className="text-xs text-blue-800 break-words overflow-hidden">
              <div className="line-clamp-3">{bias.primaryTrigger}</div>
            </div>
          </div>
        )}

        {/* Enhanced Verification Warning */}
        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-yellow-900 break-words overflow-hidden">
              <div className="line-clamp-4">
                <strong>Critical:</strong> This bias is ONE INPUT among many. Always cross-check with official exchange data (NSE/BSE), established financial portals, and your own analysis. 
                <a href="/disclosures" className="text-blue-600 hover:underline ml-1">See full due diligence requirements</a>.
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
