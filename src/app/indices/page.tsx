'use client';

import { useEffect } from 'react';
import { useMarketStore } from '@/store/marketStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Minus, RefreshCw, BarChart3, Clock } from 'lucide-react';

export default function IndicesPage() {
  const {
    niftyBias,
    bankNiftyBias,
    keyLevels,
    isLoading,
    fetchMarketData,
  } = useMarketStore();

  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  const getBiasIcon = (biasType: string) => {
    switch (biasType) {
      case 'Bullish':
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'Bearish':
        return <TrendingDown className="h-5 w-5 text-red-600" />;
      default:
        return <Minus className="h-5 w-5 text-gray-600" />;
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

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const indices = [
    {
      name: 'NIFTY 50',
      symbol: 'NIFTY',
      bias: niftyBias,
      levels: keyLevels.nifty,
      description: 'National Stock Exchange Fifty - Top 50 companies by market cap',
    },
    {
      name: 'BANK NIFTY',
      symbol: 'BANKNIFTY',
      bias: bankNiftyBias,
      levels: keyLevels.bankNifty,
      description: 'Banking sector index - 12 major banking stocks',
    },
    {
      name: 'FIN NIFTY',
      symbol: 'FINNIFTY',
      bias: null, // Not implemented yet
      levels: null,
      description: 'Financial services index - Banking and financial companies',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Indices Overview</h1>
              <p className="text-gray-600">Real-time bias and levels for major Indian indices</p>
            </div>
          </div>
          
          <Button
            variant="outline"
            onClick={() => fetchMarketData()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Indices Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {indices.map((index) => (
            <Card key={index.symbol} className="w-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">{index.name}</CardTitle>
                  {index.bias && (
                    <div className="flex items-center gap-2">
                      {getBiasIcon(index.bias.bias)}
                      <Badge className={`${getBiasColor(index.bias.bias)} font-medium`}>
                        {index.bias.bias}
                      </Badge>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600">{index.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {index.bias ? (
                  <>
                    {/* Bias Score */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="text-2xl font-bold">
                          {index.bias.score > 0 ? '+' : ''}{index.bias.score}
                        </div>
                        <div className="text-sm text-gray-600">Bias Score</div>
                      </div>
                      
                      <div className="space-y-1 text-right">
                        <div className="text-lg font-semibold">{index.bias.confidence}%</div>
                        <div className="text-sm text-gray-600">Confidence</div>
                      </div>
                    </div>

                    {/* Confidence Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          index.bias.confidence >= 70 ? 'bg-green-500' :
                          index.bias.confidence >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${index.bias.confidence}%` }}
                      />
                    </div>

                    {/* Key Levels */}
                    {index.levels && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-700">Key Levels</div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="bg-blue-50 p-2 rounded">
                            <div className="font-medium text-blue-800">PDH</div>
                            <div className="text-blue-600">{index.levels.pdh.toFixed(2)}</div>
                          </div>
                          <div className="bg-purple-50 p-2 rounded">
                            <div className="font-medium text-purple-800">PDL</div>
                            <div className="text-purple-600">{index.levels.pdl.toFixed(2)}</div>
                          </div>
                          <div className="bg-green-50 p-2 rounded">
                            <div className="font-medium text-green-800">MID</div>
                            <div className="text-green-600">{index.levels.mid.toFixed(2)}</div>
                          </div>
                          <div className="bg-orange-50 p-2 rounded">
                            <div className="font-medium text-orange-800">WH</div>
                            <div className="text-orange-600">{index.levels.weeklyHigh.toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Rationale */}
                    {index.bias.rationale.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-700">Why {index.bias.bias}?</div>
                        <div className="space-y-1">
                          {index.bias.rationale.slice(0, 2).map((reason, idx) => (
                            <div key={idx} className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                              {reason}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Timestamp */}
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>Updated: {formatTime(index.bias.lastUpdated)}</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-sm">Data not available</div>
                    <div className="text-xs">Coming soon</div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Index Composition</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">NIFTY 50</span>
                <span className="text-sm text-gray-600">50 companies</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">BANK NIFTY</span>
                <span className="text-sm text-gray-600">12 banking stocks</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">FIN NIFTY</span>
                <span className="text-sm text-gray-600">Financial services</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Trading Hours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Pre-Open</span>
                <span className="text-sm text-gray-600">09:00 - 09:15 IST</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Normal Market</span>
                <span className="text-sm text-gray-600">09:15 - 15:30 IST</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Post-Close</span>
                <span className="text-sm text-gray-600">15:40 - 16:00 IST</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
