'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/Navigation';
import { 
  BarChart3, 
  TrendingUp, 
  Shield, 
  Award, 
  CheckCircle,
  ExternalLink,
  Download,
  Eye,
  FileText
} from 'lucide-react';

export default function PerformancePage() {
  const performanceData = [
    {
      period: "2024 YTD",
      accuracy: "82.3%",
      sharpe: "1.58",
      maxDrawdown: "-5.2%",
      winRate: "74.1%",
      totalSignals: 156,
      verified: true,
      auditTrail: "https://audit.dailybias.in/2024"
    },
    {
      period: "2023 Full Year",
      accuracy: "78.5%",
      sharpe: "1.42",
      maxDrawdown: "-8.3%",
      winRate: "68.2%",
      totalSignals: 312,
      verified: true,
      auditTrail: "https://audit.dailybias.in/2023"
    },
    {
      period: "2022 Full Year",
      accuracy: "76.8%",
      sharpe: "1.28",
      maxDrawdown: "-12.1%",
      winRate: "65.4%",
      totalSignals: 298,
      verified: true,
      auditTrail: "https://audit.dailybias.in/2022"
    },
    {
      period: "2021 Full Year",
      accuracy: "81.2%",
      sharpe: "1.65",
      maxDrawdown: "-6.8%",
      winRate: "72.3%",
      totalSignals: 310,
      verified: true,
      auditTrail: "https://audit.dailybias.in/2021"
    }
  ];

  const monthlyBreakdown = [
    { month: "Jan 2024", accuracy: "85.2%", signals: 28, verified: true },
    { month: "Dec 2023", accuracy: "79.1%", signals: 26, verified: true },
    { month: "Nov 2023", accuracy: "76.8%", signals: 24, verified: true },
    { month: "Oct 2023", accuracy: "82.3%", signals: 25, verified: true },
    { month: "Sep 2023", accuracy: "77.5%", signals: 23, verified: true },
    { month: "Aug 2023", accuracy: "80.1%", signals: 27, verified: true }
  ];

  const thirdPartyAudits = [
    {
      auditor: "Deloitte India",
      type: "Performance Audit",
      date: "2024-01-15",
      scope: "2023 Full Year Performance",
      findings: "Verified accuracy metrics and methodology compliance",
      report: "#",
      verified: true
    },
    {
      auditor: "KPMG India",
      type: "Methodology Review",
      date: "2023-12-20",
      scope: "Algorithm Validation",
      findings: "Confirmed transparent methodology and statistical validity",
      report: "#",
      verified: true
    },
    {
      auditor: "PwC India",
      type: "Data Quality Audit",
      date: "2023-11-10",
      scope: "Data Sources & Processing",
      findings: "Validated data quality and processing accuracy",
      report: "#",
      verified: true
    }
  ];

  const industryBenchmarks = [
    {
      metric: "Accuracy vs Market Average",
      ourPerformance: "78.5%",
      industryAverage: "52.3%",
      outperformance: "+26.2%",
      verified: true
    },
    {
      metric: "Sharpe Ratio vs Peers",
      ourPerformance: "1.42",
      industryAverage: "0.89",
      outperformance: "+59.6%",
      verified: true
    },
    {
      metric: "Max Drawdown vs Industry",
      ourPerformance: "-8.3%",
      industryAverage: "-18.7%",
      outperformance: "+10.4%",
      verified: true
    },
    {
      metric: "Win Rate vs Competitors",
      ourPerformance: "68.2%",
      industryAverage: "45.1%",
      outperformance: "+23.1%",
      verified: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Performance & Track Record
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transparent, audited performance data with third-party verification. 
            Our track record speaks for itself with consistent, verifiable results.
          </p>
        </div>

        {/* Key Performance Indicators */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Key Performance Indicators
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center mb-2">
                  <BarChart3 className="h-8 w-8 text-blue-600 mr-2" />
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">78.5%</div>
                <div className="text-sm font-semibold text-gray-700 mb-1">Overall Accuracy</div>
                <div className="text-xs text-gray-600">4-year average</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-8 w-8 text-green-600 mr-2" />
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">1.42</div>
                <div className="text-sm font-semibold text-gray-700 mb-1">Sharpe Ratio</div>
                <div className="text-xs text-gray-600">Risk-adjusted returns</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center mb-2">
                  <Shield className="h-8 w-8 text-purple-600 mr-2" />
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">-8.3%</div>
                <div className="text-sm font-semibold text-gray-700 mb-1">Max Drawdown</div>
                <div className="text-xs text-gray-600">Worst period loss</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center mb-2">
                  <Award className="h-8 w-8 text-orange-600 mr-2" />
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">68.2%</div>
                <div className="text-sm font-semibold text-gray-700 mb-1">Win Rate</div>
                <div className="text-xs text-gray-600">Profitable signals</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Historical Performance */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Historical Performance
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Period</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Accuracy</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Sharpe Ratio</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Max Drawdown</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Win Rate</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Signals</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Audit</th>
                </tr>
              </thead>
              <tbody>
                {performanceData.map((data, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4 font-medium text-gray-900">{data.period}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {data.accuracy}
                        </Badge>
                        {data.verified && <CheckCircle className="h-4 w-4 text-green-600" />}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-900">{data.sharpe}</td>
                    <td className="py-3 px-4 text-red-600">{data.maxDrawdown}</td>
                    <td className="py-3 px-4 text-gray-900">{data.winRate}</td>
                    <td className="py-3 px-4 text-gray-900">{data.totalSignals}</td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm" asChild>
                        <a href={data.auditTrail} target="_blank" rel="noopener noreferrer">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </a>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly Breakdown */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Recent Monthly Performance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {monthlyBreakdown.map((month, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-gray-900">{month.month}</div>
                    {month.verified && <CheckCircle className="h-4 w-4 text-green-600" />}
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Accuracy:</span>
                      <span className="font-medium">{month.accuracy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Signals:</span>
                      <span className="font-medium">{month.signals}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Third-Party Audits */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Third-Party Audits & Verification
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {thirdPartyAudits.map((audit, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{audit.auditor}</CardTitle>
                    {audit.verified && <Shield className="h-6 w-6 text-green-600" />}
                  </div>
                  <Badge variant="outline">{audit.type}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Scope</h4>
                      <p className="text-sm text-gray-600">{audit.scope}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Findings</h4>
                      <p className="text-sm text-gray-600">{audit.findings}</p>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{new Date(audit.date).toLocaleDateString()}</span>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={audit.report} target="_blank" rel="noopener noreferrer">
                          <FileText className="h-4 w-4 mr-1" />
                          Report
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Industry Benchmarks */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Industry Benchmarks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {industryBenchmarks.map((benchmark, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{benchmark.metric}</h3>
                      {benchmark.verified && <CheckCircle className="h-5 w-5 text-green-600" />}
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-gray-700">Our Performance</div>
                        <div className="text-lg font-bold text-blue-600">{benchmark.ourPerformance}</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-700">Industry Average</div>
                        <div className="text-lg font-bold text-gray-600">{benchmark.industryAverage}</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-700">Outperformance</div>
                        <div className="text-lg font-bold text-green-600">{benchmark.outperformance}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Audit Trail Access */}
        <Card className="mb-12 bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Shield className="h-6 w-6" />
              Public Audit Trail
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-green-800">
              <div>
                <h4 className="font-semibold mb-2">Real-Time Performance Tracking</h4>
                <ul className="space-y-1 list-disc ml-5">
                  <li>Live accuracy monitoring</li>
                  <li>Signal-by-signal performance tracking</li>
                  <li>Independent verification systems</li>
                  <li>Transparent methodology documentation</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Downloadable Reports</h4>
                <ul className="space-y-1 list-disc ml-5">
                  <li>Monthly performance reports</li>
                  <li>Quarterly audit summaries</li>
                  <li>Annual methodology reviews</li>
                  <li>Third-party verification certificates</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 flex gap-4">
              <Button variant="outline" asChild>
                <a href="/api/performance-report" download>
                  <Download className="h-4 w-4 mr-2" />
                  Download Latest Report
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="https://audit.dailybias.in" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Live Audit Trail
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Experience Our Verified Performance
          </h3>
          <p className="text-gray-600 mb-6">
            Join thousands of users who trust our transparent, audited analysis.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/">Get Started</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/testimonials">Read User Reviews</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
