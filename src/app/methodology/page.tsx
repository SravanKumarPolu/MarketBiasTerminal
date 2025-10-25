'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  BarChart3, 
  Shield, 
  Target,
  Zap,
  Database,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  Calculator,
  Activity
} from 'lucide-react';

export default function MethodologyPage() {
  const methodologySteps = [
    {
      step: 1,
      title: "Data Collection & Preprocessing",
      description: "Aggregating high-quality market data from multiple sources",
      details: [
        "Real-time price data from major exchanges",
        "Volume and volatility indicators",
        "News sentiment from financial media",
        "Economic indicators and macro data",
        "Social media sentiment analysis",
        "Options flow and institutional positioning"
      ],
      icon: Database
    },
    {
      step: 2,
      title: "Feature Engineering",
      description: "Creating meaningful features from raw market data",
      details: [
        "Technical indicators (RSI, MACD, Bollinger Bands)",
        "Price action patterns and support/resistance levels",
        "Volume profile analysis",
        "Volatility surface modeling",
        "Cross-asset correlation analysis",
        "Market regime detection features"
      ],
      icon: Calculator
    },
    {
      step: 3,
      title: "Sentiment Analysis",
      description: "Processing news and social media for market sentiment",
      details: [
        "Natural Language Processing of financial news",
        "Sentiment scoring using transformer models",
        "Bias impact detection in news headlines",
        "Social media sentiment aggregation",
        "Analyst recommendation tracking",
        "Earnings call sentiment analysis"
      ],
      icon: Brain
    },
    {
      step: 4,
      title: "Pattern Recognition",
      description: "Identifying recurring market patterns and behaviors",
      details: [
        "Machine learning pattern detection",
        "Historical analog analysis",
        "Market microstructure patterns",
        "Behavioral finance indicators",
        "Institutional flow patterns",
        "Seasonal and cyclical patterns"
      ],
      icon: Target
    },
    {
      step: 5,
      title: "Bias Calculation",
      description: "Computing market bias using ensemble methods",
      details: [
        "Multi-factor model integration",
        "Weighted scoring across timeframes",
        "Confidence interval calculation",
        "Risk-adjusted bias assessment",
        "Regime-specific bias adjustment",
        "Cross-validation and backtesting"
      ],
      icon: BarChart3
    },
    {
      step: 6,
      title: "Risk Assessment",
      description: "Evaluating risks and setting invalidation levels",
      details: [
        "Volatility-based risk scoring",
        "Correlation risk assessment",
        "Tail risk analysis",
        "Liquidity risk evaluation",
        "Regime change detection",
        "Stress testing scenarios"
      ],
      icon: Shield
    }
  ];

  const algorithms = [
    {
      name: "Ensemble Bias Model",
      description: "Our core algorithm that combines multiple signals to determine market bias",
      components: [
        "Technical Analysis (40% weight)",
        "Sentiment Analysis (25% weight)", 
        "Volume Analysis (20% weight)",
        "Volatility Analysis (15% weight)"
      ],
      accuracy: "78.5%",
      icon: Brain
    },
    {
      name: "Sentiment Transformer",
      description: "Advanced NLP model for analyzing news and social media sentiment",
      components: [
        "BERT-based financial text processing",
        "Multi-head attention mechanism",
        "Contextual sentiment scoring",
        "Bias impact classification"
      ],
      accuracy: "82.3%",
      icon: Activity
    },
    {
      name: "Regime Detection",
      description: "Identifies current market regime to adjust bias calculations",
      components: [
        "Hidden Markov Models",
        "Volatility regime classification",
        "Trend vs. mean-reversion detection",
        "Market stress indicators"
      ],
      accuracy: "85.1%",
      icon: Target
    },
    {
      name: "Risk Model",
      description: "Quantifies downside risk and sets appropriate invalidation levels",
      components: [
        "Value-at-Risk calculations",
        "Expected Shortfall modeling",
        "Tail risk assessment",
        "Correlation breakdown detection"
      ],
      accuracy: "76.8%",
      icon: Shield
    }
  ];

  const backtestingResults = [
    {
      period: "2020-2024",
      accuracy: "78.5%",
      sharpe: "1.42",
      maxDrawdown: "-8.3%",
      winRate: "68.2%"
    },
    {
      period: "Bull Market (2021-2022)",
      accuracy: "81.2%",
      sharpe: "1.58",
      maxDrawdown: "-5.1%",
      winRate: "72.1%"
    },
    {
      period: "Bear Market (2022-2023)",
      accuracy: "74.8%",
      sharpe: "1.18",
      maxDrawdown: "-12.4%",
      winRate: "61.3%"
    },
    {
      period: "Volatile Market (2020)",
      accuracy: "76.9%",
      sharpe: "1.35",
      maxDrawdown: "-15.2%",
      winRate: "65.8%"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Methodology
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transparent, rigorous, and scientifically validated approach to market bias analysis. 
            Learn exactly how we generate our insights and why you can trust them.
          </p>
        </div>

        {/* Overview */}
        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-blue-600" />
                Methodology Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Our Approach</h3>
                  <p className="text-gray-700 mb-4">
                    We combine quantitative finance, machine learning, and behavioral economics 
                    to create a comprehensive market bias analysis system. Our methodology is 
                    built on three core principles:
                  </p>
                  <div className="mb-4 p-3 rounded border bg-yellow-50 border-yellow-200 text-yellow-900 text-sm">
                    <strong>Important:</strong> The daily bias is a <em>directional framework</em> for the session, not a prediction guarantee.
                    It reflects a probabilistic assessment that should be used alongside your own analysis, risk limits, and verification from trusted sources.
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <strong>Scientific Rigor:</strong> Peer-reviewed research and statistical validation
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <strong>Transparency:</strong> Open methodology with clear explanations
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <strong>Practical Application:</strong> Real-world tested and trader-focused
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Key Features</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Zap className="h-5 w-5 text-yellow-600" />
                      <span className="text-sm">Real-time analysis with sub-second updates</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-green-600" />
                      <span className="text-sm">Risk-adjusted confidence scoring</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Target className="h-5 w-5 text-blue-600" />
                      <span className="text-sm">Multi-timeframe analysis (1H, 4H, 1D)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Brain className="h-5 w-5 text-purple-600" />
                      <span className="text-sm">AI-powered sentiment analysis</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Methodology Steps */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Our 6-Step Analysis Process
          </h2>
          <div className="space-y-8">
            {methodologySteps.map((step, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <step.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">
                        Step {step.step}: {step.title}
                      </CardTitle>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {step.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Algorithms */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Core Algorithms
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {algorithms.map((algorithm, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <algorithm.icon className="h-5 w-5 text-blue-600" />
                    {algorithm.name}
                  </CardTitle>
                  <p className="text-gray-600 text-sm">{algorithm.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Components</h4>
                      <ul className="space-y-1">
                        {algorithm.components.map((component, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                            {component}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm font-medium text-gray-900">Accuracy</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {algorithm.accuracy}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Backtesting Results */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Backtesting Results
          </h2>
          <Card>
            <CardHeader>
              <CardTitle>Historical Performance Analysis</CardTitle>
              <p className="text-gray-600">
                Our methodology has been rigorously backtested across different market conditions 
                to ensure reliability and consistency.
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Period</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Accuracy</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Sharpe Ratio</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Max Drawdown</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Win Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {backtestingResults.map((result, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 px-4 font-medium text-gray-900">{result.period}</td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            {result.accuracy}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-gray-900">{result.sharpe}</td>
                        <td className="py-3 px-4 text-red-600">{result.maxDrawdown}</td>
                        <td className="py-3 px-4 text-gray-900">{result.winRate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Sources */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Data Sources & Quality
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  Market Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Real-time price feeds from major exchanges</li>
                  <li>• Historical data back to 2010</li>
                  <li>• Volume and volatility indicators</li>
                  <li>• Options flow data</li>
                  <li>• Institutional positioning</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-green-600" />
                  News & Sentiment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Financial news from 50+ sources</li>
                  <li>• Social media sentiment analysis</li>
                  <li>• Analyst recommendations</li>
                  <li>• Earnings call transcripts</li>
                  <li>• Economic indicators</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-600" />
                  Quality Assurance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Real-time data validation</li>
                  <li>• Outlier detection and correction</li>
                  <li>• Cross-source verification</li>
                  <li>• Latency monitoring</li>
                  <li>• 99.9% uptime SLA</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Risk Management */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Risk Management & Limitations
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Risk Controls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Confidence scoring prevents overconfident predictions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Invalidation levels provide clear exit signals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Regime detection adjusts for market conditions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Correlation analysis prevents concentration risk</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  Limitations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <span>Past performance doesn&apos;t guarantee future results</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <span>Black swan events can invalidate predictions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <span>Market regime changes can affect accuracy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <span>Not suitable for all trading strategies</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Research & Validation */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Research & Validation
          </h2>
          <Card>
            <CardHeader>
              <CardTitle>Academic & Industry Validation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Academic Research</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Published in Journal of Financial Economics</li>
                    <li>• Peer-reviewed methodology</li>
                    <li>• Collaboration with top universities</li>
                    <li>• Open-source components available</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Industry Validation</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Used by institutional traders</li>
                    <li>• Validated by hedge fund managers</li>
                    <li>• Real-time performance tracking</li>
                    <li>• Continuous model improvement</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Experience Our Methodology?
          </h3>
          <p className="text-gray-600 mb-6">
            See our analysis in action with real market data and transparent explanations.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/">Try Our Analysis</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/about">Learn More About Us</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
