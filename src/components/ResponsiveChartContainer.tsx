'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Download,
  Settings
} from 'lucide-react';

interface ResponsiveChartContainerProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  showControls?: boolean;
  onRefresh?: () => void;
  onExport?: () => void;
  onSettings?: () => void;
  maxHeight?: number;
  minHeight?: number;
}

export function ResponsiveChartContainer({
  title,
  children,
  className = '',
  showControls = true,
  onRefresh,
  onExport,
  onSettings,
  maxHeight = 500,
  minHeight = 300
}: ResponsiveChartContainerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: Math.min(rect.height, maxHeight)
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [maxHeight]);

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const containerClasses = `
    ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}
    ${className}
  `.trim();

  return (
    <Card className={containerClasses} ref={containerRef}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          {showControls && (
            <div className="flex items-center gap-2">
              {onRefresh && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRefresh}
                  className="h-8 w-8 p-0"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
              
              {onExport && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onExport}
                  className="h-8 w-8 p-0"
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
              
              {onSettings && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSettings}
                  className="h-8 w-8 p-0"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFullscreen}
                className="h-8 w-8 p-0"
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div 
          className="relative overflow-hidden"
          style={{
            height: isFullscreen ? 'calc(100vh - 120px)' : `${Math.max(minHeight, dimensions.height)}px`,
            minHeight: `${minHeight}px`
          }}
        >
          <div className="absolute inset-0">
            {children}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
