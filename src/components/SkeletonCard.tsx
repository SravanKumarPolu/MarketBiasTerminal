'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function SkeletonCard() {
  return (
    <Card 
      className="w-full animate-pulse" 
      role="status" 
      aria-label="Loading market bias data"
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="h-5 w-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded" />
          <div className="h-6 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score Section */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded" />
            <div className="h-4 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-6 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded" />
            <div className="h-4 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded" />
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded" />
        </div>
        
        {/* Rationale */}
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded" />
          <div className="space-y-2">
            <div className="h-12 w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded" />
            <div className="h-12 w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SkeletonLevels() {
  return (
    <Card 
      className="w-full animate-pulse" 
      role="status" 
      aria-label="Loading market levels data"
    >
      <CardHeader className="pb-3">
        <div className="h-5 w-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="h-4 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded" />
                <div className="h-6 w-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded" />
              </div>
              <div className="h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function SkeletonSector() {
  return (
    <Card 
      className="w-full animate-pulse" 
      role="status" 
      aria-label="Loading sector analysis data"
    >
      <CardHeader className="pb-3">
        <div className="h-5 w-40 bg-gradient-to-r from-gray-200 to-gray-300 rounded" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
