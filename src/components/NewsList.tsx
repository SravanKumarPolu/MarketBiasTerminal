'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { NewsItem } from '@/types/market';
import { ExternalLink, Clock, TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';

interface NewsListProps {
  news: NewsItem[];
  className?: string;
}

export function NewsList({ news, className }: NewsListProps) {
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

  if (news.length === 0) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Market News</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <div className="text-sm">No news available</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Market News</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {news.slice(0, 10).map((item, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 line-clamp-2">
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

              {/* Metadata */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-3 w-3" />
                  <span>{formatTimeAgo(item.pubDate)}</span>
                  <span>•</span>
                  <span>{item.source}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Sentiment Badge */}
                  {item.sentiment && (
                    <Badge className={`${getSentimentColor(item.sentiment)} text-xs`}>
                      <div className="flex items-center gap-1">
                        {getSentimentIcon(item.sentiment)}
                        <span>{item.sentiment}</span>
                      </div>
                    </Badge>
                  )}
                  
                  {/* Bias Impact Badge */}
                  {item.biasImpact && (
                    <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-xs">
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        <span>Bias Impact</span>
                      </div>
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Load More Button */}
        {news.length > 10 && (
          <div className="text-center pt-4">
            <Button variant="outline" size="sm">
              Load More News
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
