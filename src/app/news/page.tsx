'use client';

import { useEffect, useState } from 'react';
import { useMarketStore } from '@/store/marketStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NewsItem } from '@/types/market';
import { Newspaper, TrendingUp, TrendingDown, Minus, RefreshCw, ExternalLink, Clock, AlertTriangle } from 'lucide-react';

export default function NewsPage() {
  const {
    news,
    isLoading,
    fetchNews,
  } = useMarketStore();

  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [sentimentFilter, setSentimentFilter] = useState<string>('all');
  const [biasImpactFilter, setBiasImpactFilter] = useState<string>('all');

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  useEffect(() => {
    let filtered = [...news];

    // Filter by sentiment
    if (sentimentFilter !== 'all') {
      filtered = filtered.filter(item => item.sentiment === sentimentFilter);
    }

    // Filter by bias impact
    if (biasImpactFilter !== 'all') {
      filtered = filtered.filter(item => 
        biasImpactFilter === 'impact' ? item.biasImpact : !item.biasImpact
      );
    }

    setFilteredNews(filtered);
  }, [news, sentimentFilter, biasImpactFilter]);

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case 'Positive':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'Negative':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'Positive':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Negative':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTimeAgo = (pubDate: string) => {
    const now = new Date();
    const newsDate = new Date(pubDate);
    const diffInMinutes = Math.floor((now.getTime() - newsDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days}d ago`;
    }
  };

  const openNewsLink = (link: string) => {
    if (link !== '#') {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  // Statistics
  const totalNews = news.length;
  const positiveNews = news.filter(item => item.sentiment === 'Positive').length;
  const negativeNews = news.filter(item => item.sentiment === 'Negative').length;
  const biasImpactNews = news.filter(item => item.biasImpact).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Newspaper className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Market News</h1>
              <p className="text-gray-600">Latest news with sentiment analysis and bias impact</p>
            </div>
          </div>
          
          <Button
            variant="outline"
            onClick={() => fetchNews()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{totalNews}</div>
                  <div className="text-sm text-gray-600">Total News</div>
                </div>
                <Newspaper className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">{positiveNews}</div>
                  <div className="text-sm text-gray-600">Positive</div>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-red-600">{negativeNews}</div>
                  <div className="text-sm text-gray-600">Negative</div>
                </div>
                <TrendingDown className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-orange-600">{biasImpactNews}</div>
                  <div className="text-sm text-gray-600">Bias Impact</div>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Sentiment
                </label>
                <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sentiments</SelectItem>
                    <SelectItem value="Positive">Positive Only</SelectItem>
                    <SelectItem value="Negative">Negative Only</SelectItem>
                    <SelectItem value="Neutral">Neutral Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Bias Impact
                </label>
                <Select value={biasImpactFilter} onValueChange={setBiasImpactFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All News</SelectItem>
                    <SelectItem value="impact">Bias Impact Only</SelectItem>
                    <SelectItem value="no-impact">No Bias Impact</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* News List */}
        <div className="space-y-6">
          {filteredNews.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="text-gray-600">
                  {news.length === 0 ? 'No news available' : 'No news matches your filters'}
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredNews.map((item, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {item.title}
                        </h3>
                      </div>
                      
                      {item.link !== '#' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 flex-shrink-0"
                          onClick={() => openNewsLink(item.link)}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {/* Metadata and Tags */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatTimeAgo(item.pubDate)}</span>
                        </div>
                        <span>•</span>
                        <span>{item.source}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {/* Sentiment Badge */}
                        {item.sentiment && (
                          <Badge className={`${getSentimentColor(item.sentiment)} text-sm`}>
                            <div className="flex items-center gap-1">
                              {getSentimentIcon(item.sentiment)}
                              <span>{item.sentiment}</span>
                            </div>
                          </Badge>
                        )}
                        
                        {/* Bias Impact Badge */}
                        {item.biasImpact && (
                          <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-sm">
                            <div className="flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              <span>Bias Impact</span>
                            </div>
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Sentiment Analysis Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">About Sentiment Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-gray-600">
              Our sentiment analysis uses a rule-based classifier that analyzes news headlines for:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium text-green-800 mb-2">Positive Keywords:</div>
                <div className="text-gray-600">
                  upgrade, beats, profit rises, approval, expansion, record, strong demand, growth, surge, rally, gains
                </div>
              </div>
              <div>
                <div className="font-medium text-red-800 mb-2">Negative Keywords:</div>
                <div className="text-gray-600">
                  downgrade, misses, loss, probe, penalty, default, outage, resignation, fraud, decline, fall, drop
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-600 pt-3 border-t">
              <strong>Bias Impact:</strong> News items that mention NIFTY, BANK NIFTY, or specific sectors are flagged for potential market impact.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
