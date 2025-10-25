'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TrendingUp, BarChart3, Shield, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  marketStatus: {
    message: string;
  };
  isMarketOpen: boolean;
}

export function HeroSection({ marketStatus, isMarketOpen }: HeroSectionProps) {
  return (
    <section 
      className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden"
      role="banner"
      aria-label="Hero section with market analysis overview"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Animated Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="flex items-center gap-2" role="status" aria-live="polite">
              <div 
                className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 ${
                  isMarketOpen ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                }`}
                aria-label={`Market status: ${marketStatus.message}`}
              >
                <div className={`w-2 h-2 rounded-full ${isMarketOpen ? 'bg-white' : 'bg-white'}`} aria-hidden="true" />
                {marketStatus.message}
              </div>
              <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold flex items-center gap-1" aria-label="AI-powered analysis badge">
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                AI-Powered Analysis
              </div>
            </div>

            {/* Main Heading */}
            <header className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Trade Smart.
                <br />
                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Trade Aligned.
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 leading-relaxed max-w-2xl">
                Get clear, actionable daily market bias for Indian markets. 
                NIFTY 50 & BANK NIFTY insights powered by quantitative analysis.
              </p>
            </header>

            {/* Key Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" role="list" aria-label="Key features and benefits">
              <div className="flex items-start gap-3" role="listitem">
                <CheckCircle className="h-6 w-6 text-green-300 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <div className="font-semibold text-white">78.5% Accuracy</div>
                  <div className="text-sm text-blue-200">Historically verified</div>
                </div>
              </div>
              <div className="flex items-start gap-3" role="listitem">
                <CheckCircle className="h-6 w-6 text-green-300 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <div className="font-semibold text-white">Real-Time Updates</div>
                  <div className="text-sm text-blue-200">Live market data</div>
                </div>
              </div>
              <div className="flex items-start gap-3" role="listitem">
                <CheckCircle className="h-6 w-6 text-green-300 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <div className="font-semibold text-white">Transparent Methodology</div>
                  <div className="text-sm text-blue-200">Open source algorithms</div>
                </div>
              </div>
              <div className="flex items-start gap-3" role="listitem">
                <CheckCircle className="h-6 w-6 text-green-300 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <div className="font-semibold text-white">Expert Team</div>
                  <div className="text-sm text-blue-200">6 PhDs, 80+ years experience</div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <nav className="flex flex-col sm:flex-row gap-4" role="navigation" aria-label="Main call-to-action buttons">
              <Button asChild size="lg" className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-base font-semibold shadow-lg hover:shadow-xl transition-all">
                <Link 
                  href="#main-content" 
                  className="flex items-center gap-2 px-6 py-3"
                  aria-label="Get started with market analysis"
                >
                  Get Started Free
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 border-white bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white text-base font-semibold shadow-lg hover:shadow-xl transition-all">
                <Link 
                  href="/testimonials" 
                  className="flex items-center gap-2 px-6 py-3"
                  aria-label="View user testimonials and reviews"
                >
                  See User Reviews
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 border-white bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white text-base font-semibold shadow-lg hover:shadow-xl transition-all">
                <Link 
                  href="/methodology" 
                  className="flex items-center gap-2 px-6 py-3"
                  aria-label="View detailed methodology and calculation process"
                >
                  View Methodology
                </Link>
              </Button>
            </nav>
          </div>

          {/* Right Column - Stats & Visual Elements */}
          <div className="grid grid-cols-2 gap-6" role="region" aria-label="Performance statistics">
            {/* Stats Cards */}
            <HeroCard className="bg-white/10 backdrop-blur-sm border-white/20 text-center" role="region" aria-label="Accuracy rate: 78.5%">
              <div className="text-4xl font-bold mb-2">78.5%</div>
              <div className="text-sm text-blue-100">Accuracy Rate</div>
              <div className="text-xs text-blue-200 mt-1">4-year avg</div>
            </HeroCard>
            
            <HeroCard className="bg-white/10 backdrop-blur-sm border-white/20 text-center" role="region" aria-label="Sharpe ratio: 1.42">
              <div className="text-4xl font-bold mb-2">1.42</div>
              <div className="text-sm text-blue-100">Sharpe Ratio</div>
              <div className="text-xs text-blue-200 mt-1">Risk-adjusted</div>
            </HeroCard>
            
            <HeroCard className="bg-white/10 backdrop-blur-sm border-white/20 text-center col-span-2" role="region" aria-label="Market coverage: NIFTY 50 and BANKNIFTY">
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-8 w-8 text-green-300" aria-hidden="true" />
                  <div>
                    <div className="text-2xl font-bold">NIFTY 50</div>
                    <div className="text-sm text-blue-200">Real-time bias</div>
                  </div>
                </div>
                <div className="h-12 w-px bg-white/20" aria-hidden="true" />
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-8 w-8 text-green-300" aria-hidden="true" />
                  <div>
                    <div className="text-2xl font-bold">BANKNIFTY</div>
                    <div className="text-sm text-blue-200">Levels & analysis</div>
                  </div>
                </div>
              </div>
            </HeroCard>
          </div>
        </div>

        {/* Bottom Features */}
        <footer className="mt-16 pt-8 border-t border-white/20" role="contentinfo" aria-label="Additional features and credentials">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center" role="list" aria-label="Key features and credentials">
            <div className="space-y-2" role="listitem">
              <Shield className="h-8 w-8 mx-auto text-green-300" aria-hidden="true" />
              <div className="font-semibold text-lg">Audited Performance</div>
              <div className="text-sm text-blue-200">Verified by Big 4 firms</div>
            </div>
            <div className="space-y-2" role="listitem">
              <TrendingUp className="h-8 w-8 mx-auto text-green-300" aria-hidden="true" />
              <div className="font-semibold text-lg">Live Market Data</div>
              <div className="text-sm text-blue-200">Direct from NSE/BSE</div>
            </div>
            <div className="space-y-2" role="listitem">
              <BarChart3 className="h-8 w-8 mx-auto text-green-300" aria-hidden="true" />
              <div className="font-semibold text-lg">Transparent Analysis</div>
              <div className="text-sm text-blue-200">Open methodology</div>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}

function HeroCard({ children, className, role, 'aria-label': ariaLabel }: { children: React.ReactNode; className?: string; role?: string; 'aria-label'?: string }) {
  return (
    <div className={`p-6 rounded-xl ${className}`} role={role} aria-label={ariaLabel}>
      {children}
    </div>
  );
}
