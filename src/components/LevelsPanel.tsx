'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { KeyLevels } from '@/types/market';
import { Copy, Target, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

interface LevelsPanelProps {
  levels: KeyLevels;
  index: 'NIFTY' | 'BANKNIFTY';
  className?: string;
}

export function LevelsPanel({ levels, index, className }: LevelsPanelProps) {
  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
        toast.success('Copied to clipboard');
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast.error('Failed to copy to clipboard');
    }
  };

  const formatLevel = (level: number) => {
    return level.toFixed(2);
  };

  const getLevelTypeColor = (type: string) => {
    switch (type) {
      case 'pdh':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pdl':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'mid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'weekly':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const levelItems = [
    { label: 'Previous Day High', value: levels.pdh, type: 'pdh', key: 'PDH' },
    { label: 'Previous Day Low', value: levels.pdl, type: 'pdl', key: 'PDL' },
    { label: 'Central Range', value: levels.mid, type: 'mid', key: 'MID' },
    { label: 'Weekly High', value: levels.weeklyHigh, type: 'weekly', key: 'WH' },
    { label: 'Weekly Low', value: levels.weeklyLow, type: 'weekly', key: 'WL' },
  ];

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Target className="h-5 w-5" />
          Key Levels - {index}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Main Levels */}
        <div className="grid grid-cols-2 gap-3">
          {levelItems.map((item) => (
            <div key={item.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">{item.key}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => copyToClipboard(item.value.toString())}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <div className={`px-3 py-2 rounded-lg border text-center ${getLevelTypeColor(item.type)}`}>
                <div className="font-semibold text-lg">{formatLevel(item.value)}</div>
                <div className="text-xs opacity-75">{item.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Round Numbers */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="text-sm font-medium text-gray-600">Round Numbers</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {levels.roundNumbers.map((level, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs"
                onClick={() => copyToClipboard(level.toString())}
              >
                {formatLevel(level)}
              </Button>
            ))}
          </div>
        </div>

        {/* Quick Copy All */}
        <div className="pt-2 border-t">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              const allLevels = levelItems.map(item => `${item.key}: ${formatLevel(item.value)}`).join('\n');
              copyToClipboard(allLevels);
            }}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy All Levels
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
