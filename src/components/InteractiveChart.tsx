'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  LineChart, 
  Activity,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Maximize2
} from 'lucide-react';

interface ChartDataPoint {
  timestamp: string;
  value: number;
  label?: string;
}

interface InteractiveChartProps {
  data: ChartDataPoint[];
  title: string;
  type?: 'line' | 'bar' | 'area';
  height?: number;
  showControls?: boolean;
  className?: string;
  onDataPointClick?: (point: ChartDataPoint) => void;
}

export function InteractiveChart({ 
  data, 
  title, 
  type = 'line', 
  height = 300,
  showControls = true,
  className,
  onDataPointClick
}: InteractiveChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState(0);
  const [hoveredPoint, setHoveredPoint] = useState<ChartDataPoint | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chartType, setChartType] = useState(type);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Handle window resize
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    handleResize(); // Set initial size
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate chart dimensions and data bounds
  const chartWidth = isFullscreen 
    ? Math.min(windowSize.width - 100, 1200) 
    : Math.min(400, Math.max(250, (windowSize.width || 800) / 2 - 50));
  const chartHeight = isFullscreen 
    ? Math.min(windowSize.height - 200, 600) 
    : height;
  
  const minValue = Math.min(...data.map(d => d.value));
  const maxValue = Math.max(...data.map(d => d.value));
  const valueRange = maxValue - minValue;
  const padding = 40;

  // Draw chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get actual container width
    const containerWidth = canvas.parentElement?.clientWidth || chartWidth;
    const actualWidth = Math.min(containerWidth, chartWidth);
    
    // Set canvas size
    canvas.width = actualWidth;
    canvas.height = chartHeight;

    // Clear canvas
    ctx.clearRect(0, 0, actualWidth, chartHeight);

    // Calculate visible data range
    const visibleData = data.slice(Math.max(0, Math.floor(pan)), Math.min(data.length, Math.floor(pan + data.length / zoom)));
    
    if (visibleData.length === 0) return;

    // Calculate positions
    const stepX = (actualWidth - 2 * padding) / (visibleData.length - 1);
    const scaleY = (chartHeight - 2 * padding) / valueRange;

    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight - 2 * padding) * (i / 5);
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(actualWidth - padding, y);
      ctx.stroke();
    }

    // Vertical grid lines
    for (let i = 0; i < visibleData.length; i += Math.max(1, Math.floor(visibleData.length / 10))) {
      const x = padding + i * stepX;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, chartHeight - padding);
      ctx.stroke();
    }

    // Draw chart based on type
    if (chartType === 'line') {
      drawLineChart(ctx, visibleData, stepX, scaleY, padding);
    } else if (chartType === 'bar') {
      drawBarChart(ctx, visibleData, stepX, scaleY, padding);
    } else if (chartType === 'area') {
      drawAreaChart(ctx, visibleData, stepX, scaleY, padding);
    }

    // Draw axes
    drawAxes(ctx, visibleData, stepX, scaleY, padding, actualWidth, chartHeight);

    // Draw hovered point
    if (hoveredPoint) {
      const pointIndex = visibleData.findIndex(d => d.timestamp === hoveredPoint.timestamp);
      if (pointIndex !== -1) {
        const x = padding + pointIndex * stepX;
        const y = padding + (maxValue - hoveredPoint.value) * scaleY;
        
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw tooltip
        drawTooltip(ctx, hoveredPoint, x, y, actualWidth);
      }
    }

  }, [data, zoom, pan, hoveredPoint, chartType, chartWidth, chartHeight, valueRange, minValue, maxValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const drawLineChart = useCallback((ctx: CanvasRenderingContext2D, data: ChartDataPoint[], stepX: number, scaleY: number, padding: number) => {
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    data.forEach((point, index) => {
      const x = padding + index * stepX;
      const y = padding + (maxValue - point.value) * scaleY;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
  }, [maxValue]);

  const drawBarChart = useCallback((ctx: CanvasRenderingContext2D, data: ChartDataPoint[], stepX: number, scaleY: number, padding: number) => {
    const barWidth = stepX * 0.8;
    
    data.forEach((point, index) => {
      const x = padding + index * stepX - barWidth / 2;
      const y = padding + (maxValue - point.value) * scaleY;
      const barHeight = (point.value - minValue) * scaleY;
      
      ctx.fillStyle = point.value >= 0 ? '#10b981' : '#ef4444';
      ctx.fillRect(x, y, barWidth, barHeight);
    });
  }, [maxValue, minValue]);

  const drawAreaChart = useCallback((ctx: CanvasRenderingContext2D, data: ChartDataPoint[], stepX: number, scaleY: number, padding: number) => {
    // Draw area
    ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
    ctx.beginPath();
    ctx.moveTo(padding, padding + (maxValue - minValue) * scaleY);
    
    data.forEach((point, index) => {
      const x = padding + index * stepX;
      const y = padding + (maxValue - point.value) * scaleY;
      ctx.lineTo(x, y);
    });
    
    ctx.lineTo(padding + (data.length - 1) * stepX, padding + (maxValue - minValue) * scaleY);
    ctx.closePath();
    ctx.fill();
    
    // Draw line
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    data.forEach((point, index) => {
      const x = padding + index * stepX;
      const y = padding + (maxValue - point.value) * scaleY;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
  }, [maxValue, minValue]);

  const drawAxes = useCallback((ctx: CanvasRenderingContext2D, data: ChartDataPoint[], stepX: number, scaleY: number, padding: number, chartWidth: number, chartHeight: number) => {
    // X-axis
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, chartHeight - padding);
    ctx.lineTo(chartWidth - padding, chartHeight - padding);
    ctx.stroke();

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, chartHeight - padding);
    ctx.stroke();

    // Y-axis labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    
    for (let i = 0; i <= 5; i++) {
      const value = minValue + (valueRange * i / 5);
      const y = chartHeight - padding - (chartHeight - 2 * padding) * (i / 5);
      ctx.fillText(value.toFixed(1), padding - 10, y + 4);
    }

    // X-axis labels
    ctx.textAlign = 'center';
    for (let i = 0; i < data.length; i += Math.max(1, Math.floor(data.length / 5))) {
      const x = padding + i * stepX;
      const date = new Date(data[i].timestamp);
      ctx.fillText(date.toLocaleDateString(), x, chartHeight - padding + 20);
    }
  }, [minValue, valueRange]);

  const drawTooltip = useCallback((ctx: CanvasRenderingContext2D, point: ChartDataPoint, x: number, y: number, chartWidth: number) => {
    const tooltipText = `${point.label || 'Value'}: ${point.value.toFixed(2)}`;
    const tooltipDate = new Date(point.timestamp).toLocaleString();
    
    const textWidth = ctx.measureText(tooltipText).width;
    const dateWidth = ctx.measureText(tooltipDate).width;
    const tooltipWidth = Math.max(textWidth, dateWidth) + 20;
    const tooltipHeight = 50;
    
    const tooltipX = Math.max(10, Math.min(x - tooltipWidth / 2, chartWidth - tooltipWidth - 10));
    const tooltipY = Math.max(10, y - tooltipHeight - 10);
    
    // Tooltip background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);
    
    // Tooltip text
    ctx.fillStyle = 'white';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(tooltipText, tooltipX + 10, tooltipY + 20);
    ctx.fillText(tooltipDate, tooltipX + 10, tooltipY + 40);
  }, []);

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Calculate which data point is closest
    const visibleData = data.slice(Math.max(0, Math.floor(pan)), Math.min(data.length, Math.floor(pan + data.length / zoom)));
    const containerWidth = canvas.parentElement?.clientWidth || chartWidth;
    const actualWidth = Math.min(containerWidth, chartWidth);
    const stepX = (actualWidth - 2 * padding) / (visibleData.length - 1);
    const scaleY = (chartHeight - 2 * padding) / valueRange;
    
    let closestPoint: ChartDataPoint | null = null;
    let minDistance = Infinity;

    visibleData.forEach((point, index) => {
      const pointX = padding + index * stepX;
      const pointY = padding + (maxValue - point.value) * scaleY;
      const distance = Math.sqrt((x - pointX) ** 2 + (y - pointY) ** 2);
      
      if (distance < minDistance && distance < 20) {
        minDistance = distance;
        closestPoint = point;
      }
    });

    setHoveredPoint(closestPoint);
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  const handleClick = () => {
    if (hoveredPoint && onDataPointClick) {
      onDataPointClick(hoveredPoint);
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.5, 10));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.5, 0.5));
  };

  const handleReset = () => {
    setZoom(1);
    setPan(0);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `${title.replace(/\s+/g, '_')}_chart.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-gray-500">
            <div className="text-center">
              <BarChart3 className="h-8 w-8 mx-auto mb-2" />
              <div className="text-sm">No data available</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className} ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {title}
          </CardTitle>
          
          {showControls && (
            <div className="flex items-center gap-2">
              {/* Chart Type Selector */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <Button
                  variant={chartType === 'line' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setChartType('line')}
                  className="h-8 w-8 p-0"
                >
                  <LineChart className="h-4 w-4" />
                </Button>
                <Button
                  variant={chartType === 'bar' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setChartType('bar')}
                  className="h-8 w-8 p-0"
                >
                  <BarChart3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={chartType === 'area' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setChartType('area')}
                  className="h-8 w-8 p-0"
                >
                  <Activity className="h-4 w-4" />
                </Button>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" onClick={handleZoomOut} className="h-8 w-8 p-0">
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleZoomIn} className="h-8 w-8 p-0">
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleReset} className="h-8 w-8 p-0">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" onClick={handleDownload} className="h-8 w-8 p-0">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={toggleFullscreen} className="h-8 w-8 p-0">
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Chart Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span>Max: {maxValue.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingDown className="h-4 w-4 text-red-600" />
            <span>Min: {minValue.toFixed(2)}</span>
          </div>
          <Badge variant="secondary">
            {data.length} points
          </Badge>
          {hoveredPoint && (
            <Badge variant="outline">
              {hoveredPoint.value.toFixed(2)}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="relative w-full overflow-hidden">
          <div className="w-full max-w-full">
            <canvas
              ref={canvasRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
              className="cursor-crosshair border rounded-lg bg-white w-full max-w-full"
              style={{ 
                width: '100%', 
                height: `${chartHeight}px`,
                maxWidth: '100%'
              }}
            />
          </div>
          
          {/* Loading overlay */}
          {data.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <div className="text-sm text-gray-600">Loading chart data...</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
