'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { runAccessibilityAudit, startAccessibilityMonitoring, AccessibilityAuditResult } from '@/utils/accessibilityAudit';
import { validateAppColors } from '@/utils/colorContrast';
import { CheckCircle, XCircle, AlertTriangle, Info, RefreshCw, Eye, EyeOff } from 'lucide-react';

interface AccessibilityDashboardProps {
  showDetails?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function AccessibilityDashboard({ 
  showDetails = false, 
  autoRefresh = false, 
  refreshInterval = 30000 
}: AccessibilityDashboardProps) {
  const [auditResult, setAuditResult] = useState<AccessibilityAuditResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFullDetails, setShowFullDetails] = useState(showDetails);
  const [colorValidation, setColorValidation] = useState<{passed: boolean; issues: Array<{element: string; foreground: string; background: string; ratio: number; level: string; suggestion: string}>} | null>(null);

  const runAudit = async () => {
    setIsLoading(true);
    try {
      const result = runAccessibilityAudit();
      setAuditResult(result);
      
      const colorCheck = validateAppColors();
      setColorValidation(colorCheck);
    } catch (error) {
      console.error('Accessibility audit failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runAudit();
    
    if (autoRefresh) {
      const interval = setInterval(runAudit, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  useEffect(() => {
    const stopMonitoring = startAccessibilityMonitoring();
    return stopMonitoring;
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info': return <Info className="h-4 w-4 text-blue-500" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!auditResult) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Running accessibility audit...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Score Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Accessibility Score
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={runAudit}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFullDetails(!showFullDetails)}
              >
                {showFullDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showFullDetails ? 'Hide' : 'Show'} Details
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(auditResult.score)}`}>
                {auditResult.score}
              </div>
              <div className="text-sm text-gray-600">Overall Score</div>
              <Badge className={`mt-2 ${getScoreBadge(auditResult.score)}`}>
                {auditResult.passed ? 'Passed' : 'Needs Improvement'}
              </Badge>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {auditResult.issues.length}
              </div>
              <div className="text-sm text-gray-600">Issues Found</div>
              <div className="text-xs text-gray-500 mt-1">
                {auditResult.issues.filter(i => i.type === 'error').length} errors, {' '}
                {auditResult.issues.filter(i => i.type === 'warning').length} warnings
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {colorValidation?.passed ? '✓' : '✗'}
              </div>
              <div className="text-sm text-gray-600">Color Contrast</div>
              <div className="text-xs text-gray-500 mt-1">
                {colorValidation?.issues?.length || 0} contrast issues
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Issues Breakdown */}
      {showFullDetails && (
        <Card>
          <CardHeader>
            <CardTitle>Issues Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {auditResult.issues.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-green-600">No Issues Found!</p>
                  <p className="text-gray-600">Your application meets accessibility standards.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {auditResult.issues.map((issue, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        {getIssueIcon(issue.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">{issue.message}</span>
                            <Badge className={getSeverityColor(issue.severity)}>
                              {issue.severity}
                            </Badge>
                          </div>
                          {issue.element && (
                            <div className="text-sm text-gray-600 mb-1">
                              Element: {issue.element}
                            </div>
                          )}
                          {issue.suggestion && (
                            <div className="text-sm text-blue-600">
                              💡 {issue.suggestion}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {auditResult.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-800">{recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Color Contrast Details */}
      {showFullDetails && colorValidation && !colorValidation.passed && (
        <Card>
          <CardHeader>
            <CardTitle>Color Contrast Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {colorValidation.issues.map((issue: {element: string; foreground: string; background: string; ratio: number; level: string; suggestion: string}, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="font-medium">{issue.element}</span>
                    <Badge className="bg-red-100 text-red-800">
                      {issue.ratio.toFixed(2)}:1
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    Foreground: {issue.foreground} | Background: {issue.background}
                  </div>
                  <div className="text-sm text-blue-600">
                    💡 {issue.suggestion}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Compact version for status bar
export function AccessibilityStatus() {
  const [score, setScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const runQuickAudit = () => {
      try {
        const result = runAccessibilityAudit();
        setScore(result.score);
      } catch (error) {
        console.error('Quick accessibility check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    runQuickAudit();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        Checking accessibility...
      </div>
    );
  }

  if (score === null) {
    return null;
  }

  const getStatusColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (score >= 70) return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    return <XCircle className="h-4 w-4 text-red-600" />;
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      {getStatusIcon(score)}
      <span className={getStatusColor(score)}>
        Accessibility: {score}/100
      </span>
    </div>
  );
}
