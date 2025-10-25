'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, Building2, List, Newspaper, Settings, Users, BookOpen, Info, Award, Shield, FileText, ChevronDown, Activity } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: TrendingUp },
  { name: 'Indices', href: '/indices', icon: BarChart3 },
  { name: 'Sectors', href: '/sectors', icon: Building2 },
  { name: 'Stocks', href: '/stocks', icon: List },
  { name: 'Analytics', href: '/analytics', icon: Activity },
  { name: 'News', href: '/news', icon: Newspaper },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const aboutNavigation = [
  { name: 'About', href: '/about', icon: Info },
  { name: 'Team', href: '/team', icon: Users },
  { name: 'Methodology', href: '/methodology', icon: BookOpen },
  { name: 'Performance', href: '/performance', icon: TrendingUp },
  { name: 'Testimonials', href: '/testimonials', icon: Award },
];

const legalNavigation = [
  { name: 'Disclosures', href: '/disclosures', icon: Shield },
  { name: 'Terms', href: '/terms', icon: FileText },
];

export function Navigation() {
  const pathname = usePathname();
  const [isAboutMenuOpen, setIsAboutMenuOpen] = useState(false);
  const [isLegalMenuOpen, setIsLegalMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Fix hydration mismatch by only rendering interactive elements after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isAboutActive = aboutNavigation.some(item => pathname === item.href);
  const isLegalActive = legalNavigation.some(item => pathname === item.href);

  return (
    <nav className="bg-white border-b" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link 
              href="/" 
              className="flex items-center space-x-2"
              aria-label="Daily Bias India - Home"
            >
              <TrendingUp className="h-8 w-8 text-blue-600" aria-hidden="true" />
              <span className="text-xl font-bold text-gray-900">Daily Bias India</span>
            </Link>
          </div>
          
          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1" role="menubar">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  role="menuitem"
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={`Navigate to ${item.name}`}
                >
                  <Icon className="h-4 w-4 mr-1.5" aria-hidden="true" />
                  {item.name}
                </Link>
              );
            })}
            
            {/* About Dropdown */}
            <div className="relative ml-2">
              <button
                onClick={() => {
                  setIsAboutMenuOpen(!isAboutMenuOpen);
                  setIsLegalMenuOpen(false);
                }}
                className={`inline-flex items-center px-3 py-2 text-sm font-medium transition-colors ${
                  isAboutActive
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                aria-expanded={isAboutMenuOpen}
                aria-haspopup="true"
                aria-label="About menu"
                role="menuitem"
              >
                <Info className="h-4 w-4 mr-1.5" aria-hidden="true" />
                About
                {isMounted && <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${isAboutMenuOpen ? 'rotate-180' : ''}`} aria-hidden="true" />}
              </button>
              
              {isMounted && isAboutMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsAboutMenuOpen(false)}
                    aria-hidden="true"
                  />
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20"
                    role="menu"
                    aria-label="About submenu"
                  >
                    <div className="py-1">
                      {aboutNavigation.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center px-4 py-2 text-sm transition-colors ${
                              isActive
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                            onClick={() => setIsAboutMenuOpen(false)}
                            role="menuitem"
                            aria-current={isActive ? 'page' : undefined}
                            aria-label={`Navigate to ${item.name}`}
                          >
                            <Icon className="h-4 w-4 mr-2" aria-hidden="true" />
                            {item.name}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {/* Legal Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsLegalMenuOpen(!isLegalMenuOpen);
                  setIsAboutMenuOpen(false);
                }}
                className={`inline-flex items-center px-3 py-2 text-sm font-medium transition-colors ${
                  isLegalActive
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                aria-expanded={isLegalMenuOpen}
                aria-haspopup="true"
                aria-label="Legal menu"
                role="menuitem"
              >
                <Shield className="h-4 w-4 mr-1.5" aria-hidden="true" />
                Legal
                {isMounted && <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${isLegalMenuOpen ? 'rotate-180' : ''}`} aria-hidden="true" />}
              </button>
              
              {isMounted && isLegalMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsLegalMenuOpen(false)}
                    aria-hidden="true"
                  />
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20"
                    role="menu"
                    aria-label="Legal submenu"
                  >
                    <div className="py-1">
                      {legalNavigation.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center px-4 py-2 text-sm transition-colors ${
                              isActive
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                            onClick={() => setIsLegalMenuOpen(false)}
                            role="menuitem"
                            aria-current={isActive ? 'page' : undefined}
                            aria-label={`Navigate to ${item.name}`}
                          >
                            <Icon className="h-4 w-4 mr-2" aria-hidden="true" />
                            {item.name}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Mobile menu button - TODO: Implement mobile menu */}
          <div className="lg:hidden">
            <button 
              className="text-gray-600 hover:text-gray-900"
              aria-label="Open mobile menu"
              aria-expanded="false"
              aria-haspopup="true"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
