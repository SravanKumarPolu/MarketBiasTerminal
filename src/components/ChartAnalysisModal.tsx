'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Activity,
  Clock,
  Target,
  CheckCircle,
  Info
} from 'lucide-react';

interface ChartDataPoint {
  timestamp: string;
  value: number;
  label?: string;
}

interface ChartAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataPoint: ChartDataPoint | null;
  chartTitle: string;
  chartType: string;
  analysisData?: {
    trend: 'bullish' | 'bearish' | 'neutral';
    strength: number;
    support: number;
    resistance: number;
    volatility: number;
    recommendation: string;
  };
}

export function ChartAnalysisModal({ 
  isOpen, 
  onClose, 
  dataPoint, 
  chartTitle, 
  chartType,
  analysisData 
}: ChartAnalysisModalProps) {
  if (!isOpen || !dataPoint) return null;

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: 'short'
    });
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'bullish': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'bearish': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'bullish': return 'bg-green-100 text-green-800 border-green-200';
      case 'bearish': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStrengthColor = (strength: number) => {
    if (strength >= 80) return 'text-green-600';
    if (strength >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {chartTitle} - Analysis
            </CardTitle>
            <p className="text-sm text-gray-600">
              Detailed analysis for {formatTime(dataPoint.timestamp)}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Data Point Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Timestamp</span>
              </div>
              <p className="text-lg font-semibold">{formatTime(dataPoint.timestamp)}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Value</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{dataPoint.value.toFixed(2)}</p>
            </div>
          </div>

          {/* Analysis Data */}
          {analysisData && (
            <>
              {/* Trend Analysis */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Trend Analysis
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Current Trend</span>
                      <Badge className={`${getTrendColor(analysisData.trend)} flex items-center gap-1`}>
                        {getTrendIcon(analysisData.trend)}
                        {analysisData.trend.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Trend Strength</span>
                        <span className={`font-semibold ${getStrengthColor(analysisData.strength)}`}>
                          {analysisData.strength}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            analysisData.strength >= 80 ? 'bg-green-500' : 
                            analysisData.strength >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${analysisData.strength}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Volatility</span>
                      <Badge variant="outline">
                        {analysisData.volatility.toFixed(1)}%
                      </Badge>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Risk Level</span>
                        <span className={`text-sm font-medium ${
                          analysisData.volatility > 3 ? 'text-red-600' : 
                          analysisData.volatility > 1.5 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {analysisData.volatility > 3 ? 'High' : 
                           analysisData.volatility > 1.5 ? 'Medium' : 'Low'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Support & Resistance */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Key Levels
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800">Support Level</span>
                    </div>
                    <p className="text-2xl font-bold text-green-700">
                      {analysisData.support.toFixed(2)}
                    </p>
                    <p className="text-sm text-green-600">
                      Strong support zone
                    </p>
                  </div>

                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="h-4 w-4 text-red-600" />
                      <span className="font-medium text-red-800">Resistance Level</span>
                    </div>
                    <p className="text-2xl font-bold text-red-700">
                      {analysisData.resistance.toFixed(2)}
                    </p>
                    <p className="text-sm text-red-600">
                      Key resistance zone
                    </p>
                  </div>
                </div>
              </div>

              {/* Recommendation */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Trading Recommendation
                </h3>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-blue-800 mb-2">Analysis Summary</p>
                      <p className="text-blue-700">{analysisData.recommendation}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Chart Type Information */}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Chart Type</span>
              <Badge variant="secondary" className="capitalize">
                {chartType} Chart
              </Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={onClose} className="flex-1">
              Close Analysis
            </Button>
            <Button variant="outline" className="flex-1">
              Export Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
