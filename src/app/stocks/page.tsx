'use client';

import { useEffect, useState, useCallback } from 'react';
import { useMarketStore } from '@/store/marketStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { List, Search, Plus, X, TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function StocksPage() {
  const {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    fetchWatchlist,
    dataSource,
  } = useMarketStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [availableStocks, setAvailableStocks] = useState<string[]>([]);
  const [filteredStocks, setFilteredStocks] = useState<string[]>([]);
  const [selectedStock, setSelectedStock] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchAvailableStocks = useCallback(async () => {
    try {
      setIsLoading(true);
      const constituents = await dataSource.getConstituents('NIFTY50');
      setAvailableStocks(constituents);
      setFilteredStocks(constituents);
    } catch (err) {
      console.error('Failed to fetch available stocks:', err);
      toast.error('Failed to load available stocks');
    } finally {
      setIsLoading(false);
    }
  }, [dataSource]);

  useEffect(() => {
    fetchAvailableStocks();
    fetchWatchlist();
  }, [fetchAvailableStocks, fetchWatchlist]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = availableStocks.filter(stock =>
        stock.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStocks(filtered);
    } else {
      setFilteredStocks(availableStocks);
    }
  }, [searchQuery, availableStocks]);

  const handleAddToWatchlist = async (symbol: string) => {
    try {
      await addToWatchlist(symbol);
      toast.success(`${symbol} added to watchlist`);
      setSelectedStock('');
      setSearchQuery('');
    } catch {
      toast.error('Failed to add stock to watchlist');
    }
  };

  const handleRemoveFromWatchlist = (symbol: string) => {
    removeFromWatchlist(symbol);
    toast.success(`${symbol} removed from watchlist`);
  };

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

  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  const formatChange = (change: number) => {
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}`;
  };

  const formatChangePercent = (changePercent: number) => {
    const sign = changePercent > 0 ? '+' : '';
    return `${sign}${changePercent.toFixed(2)}%`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <List className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Stock Watchlist</h1>
              <p className="text-gray-600">Track your favorite NIFTY 50 stocks</p>
            </div>
          </div>
          
          <Button
            variant="outline"
            onClick={() => fetchWatchlist()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Add Stock Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="h-5 w-5" />
              <span>Add Stock to Watchlist</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search NIFTY 50 Stocks
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Type to search stocks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="sm:w-64">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Stock
                </label>
                <Select value={selectedStock} onValueChange={setSelectedStock}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a stock" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredStocks.slice(0, 10).map((stock) => (
                      <SelectItem key={stock} value={stock}>
                        {stock}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button
                  onClick={() => handleAddToWatchlist(selectedStock)}
                  disabled={!selectedStock || watchlist.some(s => s.symbol === selectedStock)}
                  className="w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Stock
                </Button>
              </div>
            </div>
            
            {/* Quick Add Popular Stocks */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">Quick Add Popular Stocks:</div>
              <div className="flex flex-wrap gap-2">
                {['RELIANCE', 'TCS', 'HDFCBANK', 'BHARTIARTL', 'ICICIBANK'].map((stock) => (
                  <Button
                    key={stock}
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddToWatchlist(stock)}
                    disabled={watchlist.some(s => s.symbol === stock)}
                  >
                    {stock}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Watchlist */}
        <div className="space-y-6">
          {watchlist.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <List className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="text-gray-600 mb-4">No stocks in your watchlist</div>
                <div className="text-sm text-gray-500">
                  Add stocks from the NIFTY 50 index to start tracking their performance
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {watchlist.map((stock) => (
                <Card key={stock.symbol} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold">{stock.symbol}</CardTitle>
                      <div className="flex items-center gap-2">
                        {stock.bias && (
                          <Badge className={`${getBiasColor(stock.bias)} text-xs`}>
                            <div className="flex items-center gap-1">
                              {getBiasIcon(stock.bias)}
                              <span>{stock.bias}</span>
                            </div>
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => handleRemoveFromWatchlist(stock.symbol)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">{stock.name}</div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Price and Change */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-gray-900">
                          ₹{formatPrice(stock.lastPrice)}
                        </div>
                        <div className={`text-lg font-semibold ${
                          stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatChange(stock.change)}
                        </div>
                      </div>
                      <div className={`text-sm font-medium ${
                        stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatChangePercent(stock.changePercent)}
                      </div>
                    </div>

                    {/* Previous Day Range */}
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-700">Previous Day Range</div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-red-50 p-2 rounded">
                          <div className="font-medium text-red-800">Low</div>
                          <div className="text-red-600">₹{formatPrice(stock.previousDayRange.low)}</div>
                        </div>
                        <div className="bg-green-50 p-2 rounded">
                          <div className="font-medium text-green-800">High</div>
                          <div className="text-green-600">₹{formatPrice(stock.previousDayRange.high)}</div>
                        </div>
                      </div>
                    </div>

                    {/* Pre-Open Note */}
                    {stock.preOpenNote && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-sm font-medium text-blue-900 mb-1">Pre-Open Note</div>
                        <div className="text-xs text-blue-800">{stock.preOpenNote}</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Stock Universe Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">About NIFTY 50</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-gray-600">
              The NIFTY 50 is a benchmark Indian stock market index that represents the weighted average of 50 of the largest Indian companies listed on the National Stock Exchange.
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-medium text-gray-900">Total Stocks</div>
                <div className="text-gray-600">50 companies</div>
              </div>
              <div>
                <div className="font-medium text-gray-900">Market Coverage</div>
                <div className="text-gray-600">~65% of free float market cap</div>
              </div>
              <div>
                <div className="font-medium text-gray-900">Rebalancing</div>
                <div className="text-gray-600">Semi-annually</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
