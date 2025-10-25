'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  TrendingUp, 
  BarChart3, 
  Target, 
  Clock, 
  Shield,
  CheckCircle,
  Sparkles
} from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  highlight?: boolean;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Daily Bias India',
    description: 'Get AI-powered market analysis for NIFTY 50 & BANK NIFTY with 78.5% historical accuracy.',
    icon: <Sparkles className="h-6 w-6 text-blue-600" />,
    target: 'hero-section',
    position: 'bottom',
    highlight: true
  },
  {
    id: 'bias-cards',
    title: 'Market Bias Analysis',
    description: 'View real-time bias signals with confidence scores and detailed rationale for each index.',
    icon: <TrendingUp className="h-6 w-6 text-green-600" />,
    target: 'bias-cards',
    position: 'top'
  },
  {
    id: 'key-levels',
    title: 'Key Support & Resistance',
    description: 'Copy key levels directly to your trading platform. Click any level to copy to clipboard.',
    icon: <Target className="h-6 w-6 text-purple-600" />,
    target: 'key-levels',
    position: 'top'
  },
  {
    id: 'first-15m',
    title: 'First 15 Minutes Range',
    description: 'Critical opening range analysis for day trading strategies and breakout identification.',
    icon: <Clock className="h-6 w-6 text-orange-600" />,
    target: 'first-15m',
    position: 'top'
  },
  {
    id: 'sector-heatmap',
    title: 'Sector Performance',
    description: 'Real-time sector heatmap showing which sectors are leading or lagging the market.',
    icon: <BarChart3 className="h-6 w-6 text-red-600" />,
    target: 'sector-heatmap',
    position: 'left'
  },
  {
    id: 'interactive-charts',
    title: 'Interactive Charts',
    description: 'Real-time performance charts with zoom, pan, and interactive data points for detailed analysis.',
    icon: <BarChart3 className="h-6 w-6 text-blue-600" />,
    target: 'charts-section',
    position: 'top'
  },
  {
    id: 'news-sentiment',
    title: 'News & Sentiment',
    description: 'Market-relevant news with AI-powered sentiment analysis to understand market mood.',
    icon: <Shield className="h-6 w-6 text-indigo-600" />,
    target: 'news-section',
    position: 'left'
  }
];

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function OnboardingTour({ isOpen, onClose, onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Scroll to the target element
      const targetElement = document.querySelector(`[data-onboarding="${onboardingSteps[currentStep].target}"]`);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [isOpen, currentStep]);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  if (!isOpen || !isVisible) return null;

  const currentStepData = onboardingSteps[currentStep];
  const targetElement = document.querySelector(`[data-onboarding="${currentStepData.target}"]`);
  
  if (!targetElement) return null;

  const rect = targetElement.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

  const getTooltipPosition = () => {
    const offset = 20;
    let top = rect.top + scrollTop;
    let left = rect.left + scrollLeft;

    switch (currentStepData.position) {
      case 'top':
        top = rect.top + scrollTop - 200;
        left = rect.left + scrollLeft + rect.width / 2 - 200;
        break;
      case 'bottom':
        top = rect.bottom + scrollTop + offset;
        left = rect.left + scrollLeft + rect.width / 2 - 200;
        break;
      case 'left':
        top = rect.top + scrollTop + rect.height / 2 - 100;
        left = rect.left + scrollLeft - 420;
        break;
      case 'right':
        top = rect.top + scrollTop + rect.height / 2 - 100;
        left = rect.right + scrollLeft + offset;
        break;
    }

    return { top: Math.max(20, top), left: Math.max(20, left) };
  };

  const position = getTooltipPosition();

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={handleSkip}
        aria-hidden="true"
      />
      
      {/* Highlight overlay for target element */}
      <div
        className="fixed z-50 pointer-events-none"
        style={{
          top: rect.top + scrollTop - 4,
          left: rect.left + scrollLeft - 4,
          width: rect.width + 8,
          height: rect.height + 8,
          border: '3px solid #3b82f6',
          borderRadius: '8px',
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.3)',
        }}
      />

      {/* Tooltip */}
      <div
        className="fixed z-50 w-80 max-w-sm"
        style={{
          top: position.top,
          left: position.left,
        }}
      >
        <Card className="shadow-2xl border-2 border-blue-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {currentStepData.icon}
                <CardTitle className="text-lg">{currentStepData.title}</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
                aria-label="Close tour"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {currentStepData.highlight && (
              <Badge className="bg-green-100 text-green-800 w-fit">
                <CheckCircle className="h-3 w-3 mr-1" />
                New User
              </Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">{currentStepData.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNext}
                >
                  {currentStep === onboardingSteps.length - 1 ? 'Finish' : 'Next'}
                  {currentStep === onboardingSteps.length - 1 ? (
                    <CheckCircle className="h-4 w-4 ml-1" />
                  ) : (
                    <ArrowRight className="h-4 w-4 ml-1" />
                  )}
                </Button>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="text-gray-500"
              >
                Skip Tour
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-1">
              {onboardingSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    index === currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

// Hook to manage onboarding state
export function useOnboarding() {
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);

  useEffect(() => {
    // Check if this is the user's first visit
    const hasSeenOnboarding = localStorage.getItem('onboarding-completed');
    if (!hasSeenOnboarding) {
      setIsFirstVisit(true);
      // Auto-start tour after a short delay
      const timer = setTimeout(() => {
        setIsTourOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const startTour = () => {
    setIsTourOpen(true);
  };

  const closeTour = () => {
    setIsTourOpen(false);
  };

  const completeTour = () => {
    localStorage.setItem('onboarding-completed', 'true');
    setIsTourOpen(false);
    setIsFirstVisit(false);
  };

  return {
    isFirstVisit,
    isTourOpen,
    startTour,
    closeTour,
    completeTour
  };
}
