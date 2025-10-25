'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart,
  Activity,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface MobileAnalyticsProps {
  className?: string;
}

export function MobileAnalytics({ className = '' }: MobileAnalyticsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentMetric, setCurrentMetric] = useState(0);

  const metrics = [
    { label: 'Total Return', value: '+12.5%', color: 'text-green-600', icon: TrendingUp },
    { label: 'Volatility', value: '15.2%', color: 'text-orange-600', icon: Activity },
    { label: 'Sharpe Ratio', value: '1.8', color: 'text-blue-600', icon: Target },
    { label: 'Max Drawdown', value: '-8.3%', color: 'text-red-600', icon: AlertTriangle }
  ];

  const sectorData = [
    { name: 'Financial Services', weight: 32.5, return: 15.2, color: '#3B82F6' },
    { name: 'Information Technology', weight: 18.7, return: 22.1, color: '#10B981' },
    { name: 'Energy', weight: 12.3, return: 8.9, color: '#F59E0B' },
    { name: 'Healthcare', weight: 9.8, return: 11.5, color: '#EF4444' },
    { name: 'Consumer Goods', weight: 8.2, return: 6.3, color: '#8B5CF6' },
    { name: 'Others', weight: 18.5, return: 9.7, color: '#6B7280' }
  ];

  const nextMetric = () => {
    setCurrentMetric((prev) => (prev + 1) % metrics.length);
  };

  const prevMetric = () => {
    setCurrentMetric((prev) => (prev - 1 + metrics.length) % metrics.length);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Mobile Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Analytics</h2>
        <Badge variant="outline" className="text-xs">
          Live Data
        </Badge>
      </div>

      {/* Mobile Metric Carousel */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={prevMetric}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex-1 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                {React.createElement(metrics[currentMetric].icon, { className: "h-4 w-4" })}
                <span className="text-sm font-medium text-gray-600">
                  {metrics[currentMetric].label}
                </span>
              </div>
              <div className={`text-2xl font-bold ${metrics[currentMetric].color}`}>
                {metrics[currentMetric].value}
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={nextMetric}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Progress dots */}
          <div className="flex justify-center gap-1">
            {metrics.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentMetric ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mobile Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="text-xs">
            <BarChart3 className="h-3 w-3 mr-1" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="performance" className="text-xs">
            <TrendingUp className="h-3 w-3 mr-1" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="sectors" className="text-xs">
            <PieChart className="h-3 w-3 mr-1" />
            Sectors
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Market Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-sm text-gray-600">NIFTY 50</div>
                  <div className="text-lg font-bold text-green-600">+2.1%</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-gray-600">BANK NIFTY</div>
                  <div className="text-lg font-bold text-blue-600">+1.8%</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Strong positive momentum</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Low volatility environment</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">Moderate risk level</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Total Return', value: '+12.5%', color: 'text-green-600' },
                { label: 'Volatility', value: '15.2%', color: 'text-orange-600' },
                { label: 'Sharpe Ratio', value: '1.8', color: 'text-blue-600' },
                { label: 'Max Drawdown', value: '-8.3%', color: 'text-red-600' }
              ].map((metric, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <span className="text-sm text-gray-600">{metric.label}</span>
                  <span className={`text-sm font-medium ${metric.color}`}>
                    {metric.value}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Risk Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Beta', value: '1.2', color: 'text-gray-600' },
                { label: 'Alpha', value: '+2.1%', color: 'text-green-600' },
                { label: 'R²', value: '0.85', color: 'text-blue-600' },
                { label: 'Tracking Error', value: '3.2%', color: 'text-orange-600' }
              ].map((metric, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <span className="text-sm text-gray-600">{metric.label}</span>
                  <span className={`text-sm font-medium ${metric.color}`}>
                    {metric.value}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sectors Tab */}
        <TabsContent value="sectors" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Sector Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sectorData.map((sector, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: sector.color }}
                    />
                    <span className="text-sm font-medium">{sector.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {sector.return > 0 ? '+' : ''}{sector.return}%
                    </div>
                    <div className="text-xs text-gray-500">{sector.weight}%</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Top Performers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sectorData
                  .sort((a, b) => b.return - a.return)
                  .slice(0, 3)
                  .map((sector, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          #{index + 1}
                        </Badge>
                        <span className="text-sm font-medium">{sector.name}</span>
                      </div>
                      <span className="text-sm font-bold text-green-600">
                        +{sector.return}%
                      </span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
