'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { First15mData } from '@/types/market';
import { Clock, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

interface First15mBoxProps {
  data: First15mData | null;
  index: 'NIFTY' | 'BANKNIFTY';
  className?: string;
}

export function First15mBox({ data, index, className }: First15mBoxProps) {
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

  const formatPrice = (price: number) => {
    try {
      if (isNaN(price) || !isFinite(price)) {
        return '0.00';
      }
      return price.toFixed(2);
    } catch (error) {
      console.error('Error formatting price:', error);
      return '0.00';
    }
  };

  const getRangeSize = () => {
    if (!data) return 0;
    try {
      const range = data.high - data.low;
      return isNaN(range) || !isFinite(range) ? 0 : range;
    } catch (error) {
      console.error('Error calculating range size:', error);
      return 0;
    }
  };

  const isAfterMarketOpen = () => {
    try {
      const now = new Date();
      const istTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
      
      if (isNaN(istTime.getTime())) {
        return false; // If timezone conversion fails, assume not after market open
      }
      
      const hour = istTime.getHours();
      const minute = istTime.getMinutes();
      const currentMinutes = hour * 60 + minute;
      const showTime = 9 * 60 + 30; // 9:30 AM - after first 15m completes
      return currentMinutes >= showTime;
    } catch (error) {
      console.error('Error checking market time:', error);
      return false;
    }
  };

  if (!data && !isAfterMarketOpen()) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5" />
            First 15m Range - {index}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-gray-500">
            <div className="text-center">
              <Clock className="h-8 w-8 mx-auto mb-2" />
              <div className="text-sm">Waiting for first 15 minutes to complete</div>
              <div className="text-xs">First 15m range appears after 09:30 IST</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5" />
            First 15m Range - {index}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-gray-500">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 mx-auto mb-2" />
              <div className="text-sm">No data available</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full card-overflow-safe ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between min-w-0 overflow-hidden">
          <CardTitle className="text-lg font-semibold flex items-center gap-2 min-w-0 flex-1">
            <Clock className="h-5 w-5 flex-shrink-0" />
            <span className="truncate">First 15m Range - {index}</span>
          </CardTitle>
          <Badge variant={data.isComplete ? 'default' : 'secondary'}>
            {data.isComplete ? 'Complete' : 'Live'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Range Display */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center overflow-hidden">
            <div className="text-2xl font-bold text-red-600 break-words">{formatPrice(data.low)}</div>
            <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <TrendingDown className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">Low</span>
            </div>
          </div>
          
          <div className="text-center overflow-hidden">
            <div className="text-lg font-semibold text-gray-800 break-words">{formatPrice(getRangeSize())}</div>
            <div className="text-sm text-gray-600 truncate">Range Size</div>
          </div>
          
          <div className="text-center overflow-hidden">
            <div className="text-2xl font-bold text-green-600 break-words">{formatPrice(data.high)}</div>
            <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <TrendingUp className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">High</span>
            </div>
          </div>
        </div>

        {/* Range Visualization */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">Range Visualization</div>
          <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 opacity-20" />
            </div>
            <div className="absolute inset-0 flex items-center justify-between px-2">
              <span className="text-xs font-medium text-red-700 truncate">{formatPrice(data.low)}</span>
              <span className="text-xs font-medium text-green-700 truncate">{formatPrice(data.high)}</span>
            </div>
          </div>
        </div>

        {/* Trading Guidelines */}
        <div className="bg-blue-50 p-3 rounded-lg overflow-hidden">
          <div className="text-sm font-medium text-blue-900 mb-2">Trading Guidelines</div>
          <div className="text-xs text-blue-800 space-y-1">
            <div className="break-words">• Break above high + retest = Long opportunity</div>
            <div className="break-words">• Break below low + retest = Short opportunity</div>
            <div className="break-words">• Stay within range = Wait for breakout</div>
          </div>
        </div>

        {/* Timestamp */}
        <div className="text-xs text-gray-500 text-center">
          Updated: {formatTime(data.timestamp)}
        </div>
      </CardContent>
    </Card>
  );
}
