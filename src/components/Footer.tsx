'use client';

import Link from 'next/link';
import { TrendingUp, Shield, Award } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">Daily Bias India</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Empowering traders with AI-driven market bias analysis, backed by quantitative research 
              and transparent methodology.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Shield className="h-4 w-4" />
                <span>78.5% Accuracy</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Award className="h-4 w-4" />
                <span>PhD Team</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/indices" className="text-gray-300 hover:text-white transition-colors">
                  Indices
                </Link>
              </li>
              <li>
                <Link href="/sectors" className="text-gray-300 hover:text-white transition-colors">
                  Sectors
                </Link>
              </li>
              <li>
                <Link href="/stocks" className="text-gray-300 hover:text-white transition-colors">
                  Stocks
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-gray-300 hover:text-white transition-colors">
                  News
                </Link>
              </li>
              <li>
                <Link href="/disclosures" className="text-gray-300 hover:text-white transition-colors">
                  Disclosures
                </Link>
              </li>
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-gray-300 hover:text-white transition-colors">
                  Our Team
                </Link>
              </li>
              <li>
                <Link href="/methodology" className="text-gray-300 hover:text-white transition-colors">
                  Methodology
                </Link>
              </li>
              <li>
                <Link href="/settings" className="text-gray-300 hover:text-white transition-colors">
                  Settings
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              © 2024 Daily Bias India. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <span>
                <strong>Disclaimer:</strong> For educational purposes only. Not investment advice.
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
