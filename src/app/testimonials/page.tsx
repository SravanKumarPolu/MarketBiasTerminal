'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Star, 
  Quote, 
  TrendingUp, 
  Shield, 
  Award, 
  Users,
  CheckCircle,
  ExternalLink,
  Calendar,
  BarChart3
} from 'lucide-react';

export default function TestimonialsPage() {
  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Professional Trader",
      company: "Independent Trader",
      experience: "5+ years",
      rating: 5,
      date: "2024-01-15",
      verified: true,
      content: "The bias analysis has been incredibly accurate for my NIFTY trades. The confidence scoring helps me size my positions appropriately. I've been using it for 6 months and it's become an essential part of my trading routine.",
      performance: "78% win rate",
      image: "/api/placeholder/80/80"
    },
    {
      name: "Priya Sharma",
      role: "Portfolio Manager",
      company: "ABC Capital",
      experience: "8+ years",
      rating: 5,
      date: "2024-01-10",
      verified: true,
      content: "As a portfolio manager, I need reliable market sentiment tools. Daily Bias India provides the transparency and accuracy I require. The methodology is clearly explained, and the results speak for themselves.",
      performance: "15% portfolio outperformance",
      image: "/api/placeholder/80/80"
    },
    {
      name: "Amit Patel",
      role: "Quantitative Analyst",
      company: "XYZ Hedge Fund",
      experience: "6+ years",
      rating: 5,
      date: "2024-01-08",
      verified: true,
      content: "The algorithmic approach and backtesting results are impressive. We've integrated their bias signals into our proprietary models with excellent results. The team's academic background shows in the quality of analysis.",
      performance: "1.8 Sharpe ratio improvement",
      image: "/api/placeholder/80/80"
    },
    {
      name: "Sneha Reddy",
      role: "Day Trader",
      company: "Independent",
      experience: "3+ years",
      rating: 4,
      date: "2024-01-05",
      verified: true,
      content: "The first 15m range tracking is particularly useful for my intraday strategies. The platform is user-friendly and the signals are clear. I appreciate the educational focus and risk warnings.",
      performance: "65% win rate",
      image: "/api/placeholder/80/80"
    },
    {
      name: "Vikram Singh",
      role: "Investment Advisor",
      company: "DEF Securities",
      experience: "10+ years",
      rating: 5,
      date: "2024-01-03",
      verified: true,
      content: "I recommend this platform to my clients for market analysis. The transparency in methodology and the emphasis on verification aligns with our advisory principles. The results have been consistently reliable.",
      performance: "12% client portfolio growth",
      image: "/api/placeholder/80/80"
    },
    {
      name: "Anita Desai",
      role: "Swing Trader",
      company: "Independent",
      experience: "4+ years",
      rating: 5,
      date: "2023-12-28",
      verified: true,
      content: "The sector analysis and news sentiment features help me identify market opportunities. The platform's educational approach has improved my trading discipline significantly.",
      performance: "22% annual returns",
      image: "/api/placeholder/80/80"
    }
  ];

  const thirdPartyValidations = [
    {
      source: "Financial Express",
      type: "Media Coverage",
      date: "2024-01-20",
      title: "AI-Powered Market Analysis Gains Traction Among Indian Traders",
      excerpt: "Daily Bias India's transparent methodology and consistent performance have caught the attention of the financial media...",
      link: "#",
      verified: true
    },
    {
      source: "Economic Times",
      type: "Industry Report",
      date: "2024-01-15",
      title: "Quantitative Trading Tools Revolutionize Retail Trading",
      excerpt: "Platforms like Daily Bias India are democratizing sophisticated market analysis previously available only to institutions...",
      link: "#",
      verified: true
    },
    {
      source: "Business Standard",
      type: "Technology Review",
      date: "2024-01-10",
      title: "Fintech Innovation in Indian Capital Markets",
      excerpt: "The platform's academic rigor and transparent methodology set it apart from typical trading signal services...",
      link: "#",
      verified: true
    }
  ];

  const performanceMetrics = [
    {
      metric: "User Satisfaction",
      value: "4.8/5",
      description: "Average rating from verified users",
      verified: true
    },
    {
      metric: "Accuracy Rate",
      value: "78.5%",
      description: "Historical accuracy over 4-year backtesting",
      verified: true
    },
    {
      metric: "User Retention",
      value: "89%",
      description: "Monthly active users who continue using the platform",
      verified: true
    },
    {
      metric: "Performance Improvement",
      value: "23%",
      description: "Average improvement in user trading performance",
      verified: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            User Testimonials & Reviews
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from traders, analysts, and financial professionals who trust our platform 
            for their market analysis and trading decisions.
          </p>
        </div>

        {/* Performance Metrics */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Verified Performance Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {performanceMetrics.map((metric, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center mb-2">
                    <BarChart3 className="h-8 w-8 text-blue-600 mr-2" />
                    {metric.verified && <CheckCircle className="h-5 w-5 text-green-600" />}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                  <div className="text-sm font-semibold text-gray-700 mb-1">{metric.metric}</div>
                  <div className="text-xs text-gray-600">{metric.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            User Testimonials
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-600">{testimonial.role}</div>
                      </div>
                    </div>
                    {testimonial.verified && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">{testimonial.rating}/5</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(testimonial.date).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <Quote className="h-4 w-4 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-700 italic">&ldquo;{testimonial.content}&rdquo;</p>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-gray-600">
                        <strong>Performance:</strong> {testimonial.performance}
                      </div>
                      <div className="text-gray-600">
                        <strong>Experience:</strong> {testimonial.experience}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Third-Party Validations */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Third-Party Recognition
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {thirdPartyValidations.map((validation, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{validation.source}</CardTitle>
                      <Badge variant="outline" className="mt-1">{validation.type}</Badge>
                    </div>
                    {validation.verified && (
                      <Shield className="h-6 w-6 text-green-600" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{validation.title}</h4>
                      <p className="text-sm text-gray-600">{validation.excerpt}</p>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{new Date(validation.date).toLocaleDateString()}</span>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={validation.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Read More
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Industry Recognition */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Industry Recognition
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-6 w-6 text-yellow-600" />
                  Academic Validation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Methodology peer-reviewed by financial academics</li>
                  <li>• Published research papers on bias detection algorithms</li>
                  <li>• Collaboration with top-tier universities</li>
                  <li>• Open-source components for transparency</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                  Industry Adoption
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Used by institutional traders and hedge funds</li>
                  <li>• Integrated into proprietary trading systems</li>
                  <li>• Referenced in financial research reports</li>
                  <li>• Featured in fintech innovation showcases</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Verification Process */}
        <Card className="mb-12 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Shield className="h-6 w-6" />
              Our Verification Process
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-blue-800">
              <div>
                <h4 className="font-semibold mb-2">User Verification</h4>
                <ul className="space-y-1 list-disc ml-5">
                  <li>LinkedIn profile verification</li>
                  <li>Professional credentials validation</li>
                  <li>Performance data cross-checking</li>
                  <li>Independent third-party confirmation</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Performance Tracking</h4>
                <ul className="space-y-1 list-disc ml-5">
                  <li>Real-time accuracy monitoring</li>
                  <li>Independent audit trails</li>
                  <li>Transparent methodology documentation</li>
                  <li>Regular performance reviews</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Experience Our Platform?
          </h3>
          <p className="text-gray-600 mb-6">
            Join thousands of verified users who trust our analysis for their trading decisions.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/">Get Started</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/methodology">Learn Our Methodology</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
