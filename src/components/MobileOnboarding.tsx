'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { TrendingUp, BarChart3, Newspaper, Settings, X, CheckCircle } from 'lucide-react';

interface OnboardingStep {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
}

const steps: OnboardingStep[] = [
  {
    title: 'Welcome to Daily Bias India',
    description: 'Your trusted source for Indian market analysis',
    icon: TrendingUp,
    features: ['Real-time NIFTY & BANKNIFTY bias', 'Key levels with copy-to-clipboard', 'AI-powered sentiment analysis']
  },
  {
    title: 'Market Dashboard',
    description: 'Get comprehensive market insights at a glance',
    icon: BarChart3,
    features: ['Bias scores and confidence levels', 'Sector performance heatmap', 'First 15-minute range analysis']
  },
  {
    title: 'Stay Informed',
    description: 'Never miss important market news',
    icon: Newspaper,
    features: ['Real-time news feed', 'Sentiment analysis', 'Bias-impact detection']
  },
  {
    title: 'Customize Your Experience',
    description: 'Tailor the platform to your trading style',
    icon: Settings,
    features: ['Configure refresh intervals', 'Set default instruments', 'Manage watchlists']
  }
];

export function MobileOnboarding() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding
    const hasSeenOnboarding = localStorage.getItem('hasCompletedOnboarding');
    if (!hasSeenOnboarding) {
      setIsOpen(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    setIsCompleted(true);
    localStorage.setItem('hasCompletedOnboarding', 'true');
    setTimeout(() => setIsOpen(false), 500);
  };

  if (!isOpen) return null;

  const current = steps[currentStep];
  const Icon = current.icon;
  const progress = ((currentStep + 1) / steps.length) * 100;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={handleSkip}
        aria-hidden="true"
      />

      {/* Onboarding Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
                        className="w-full max-w-md bg-white rounded-2xl shadow-2xl pointer-events-auto animate-slide-up border-0"
              role="dialog"
              aria-modal="true"
              aria-labelledby="onboarding-title"
            >
              <div className="border-0 shadow-none">
                {/* Close Button */}
                <div className="flex justify-end p-4">
                  <button
                    onClick={handleSkip}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Skip onboarding"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="px-6 pb-4">
                  <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                      role="progressbar"
                      aria-valuenow={progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                  <div className="text-right text-xs text-gray-500 mt-2">
                    {currentStep + 1} of {steps.length}
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 pb-6 space-y-6">
                  {/* Icon */}
                  <div className="flex justify-center">
                    <div className="p-4 bg-blue-100 rounded-full">
                      <Icon className="h-12 w-12 text-blue-600" aria-hidden="true" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="text-center space-y-2">
                    <h3 id="onboarding-title" className="text-2xl font-bold text-gray-900">{current.title}</h3>
                    <p className="text-gray-600">{current.description}</p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3" role="list">
                    {current.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" aria-hidden="true" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="px-6 pb-6 space-y-3">
                  <Button
                    onClick={handleNext}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-base font-semibold"
                    size="lg"
                  >
                    {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
                  </Button>
                  <Button
                    onClick={handleSkip}
                    variant="ghost"
                    className="w-full"
                  >
                    Skip Tour
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
  );
}
