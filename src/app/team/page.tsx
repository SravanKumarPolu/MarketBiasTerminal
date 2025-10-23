'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/Navigation';
import { 
  Users, 
  Award, 
  BookOpen, 
  TrendingUp, 
  Shield, 
  Brain,
  BarChart3,
  Globe,
  Linkedin,
  Twitter,
  Github
} from 'lucide-react';

export default function TeamPage() {
  const teamMembers = [
    {
      name: "Dr. Sarah Chen",
      role: "Chief Data Scientist",
      expertise: ["Machine Learning", "Quantitative Finance", "Risk Management"],
      experience: "12+ years",
      education: "PhD in Computational Finance, MIT",
      bio: "Former Goldman Sachs quant researcher with expertise in algorithmic trading and market microstructure. Published 20+ papers in top-tier finance journals.",
      achievements: [
        "Led AI research team at JP Morgan",
        "Author of &apos;Machine Learning in Finance&apos;",
        "CFA Charterholder"
      ],
      image: "/api/placeholder/300/300",
      social: {
        linkedin: "https://linkedin.com/in/sarahchen",
        twitter: "https://twitter.com/sarahchen_ai"
      }
    },
    {
      name: "Michael Rodriguez",
      role: "Head of Trading Strategy",
      expertise: ["Options Trading", "Volatility Analysis", "Portfolio Management"],
      experience: "15+ years",
      education: "MBA in Finance, Wharton",
      bio: "Former hedge fund manager with $2B+ AUM. Specialized in volatility trading and market neutral strategies. Expert in derivatives and risk management.",
      achievements: [
        "Managed $2B+ hedge fund portfolio",
        "Former Citadel derivatives trader",
        "CFA & FRM certified"
      ],
      image: "/api/placeholder/300/300",
      social: {
        linkedin: "https://linkedin.com/in/michaelrodriguez",
        twitter: "https://twitter.com/mrodriguez_trader"
      }
    },
    {
      name: "Dr. Priya Sharma",
      role: "Lead AI Engineer",
      expertise: ["Natural Language Processing", "Sentiment Analysis", "Deep Learning"],
      experience: "10+ years",
      education: "PhD in Computer Science, Stanford",
      bio: "AI researcher specializing in financial NLP and sentiment analysis. Former Google AI researcher with expertise in transformer models and financial text processing.",
      achievements: [
        "Former Google AI researcher",
        "Published in NeurIPS, ICML",
        "Patent holder in NLP applications"
      ],
      image: "/api/placeholder/300/300",
      social: {
        linkedin: "https://linkedin.com/in/priyasharma",
        github: "https://github.com/priyasharma"
      }
    },
    {
      name: "James Thompson",
      role: "Senior Quantitative Analyst",
      expertise: ["Statistical Modeling", "Time Series Analysis", "Backtesting"],
      experience: "8+ years",
      education: "MSc in Financial Engineering, Columbia",
      bio: "Quantitative analyst with deep expertise in statistical modeling and backtesting. Former Renaissance Technologies researcher specializing in market regime detection.",
      achievements: [
        "Former RenTech researcher",
        "Expert in regime detection models",
        "PhD in Statistics, Princeton"
      ],
      image: "/api/placeholder/300/300",
      social: {
        linkedin: "https://linkedin.com/in/jamesthompson",
        github: "https://github.com/jamesthompson"
      }
    },
    {
      name: "Dr. Alex Kim",
      role: "Head of Research",
      expertise: ["Market Microstructure", "Behavioral Finance", "Alternative Data"],
      experience: "14+ years",
      education: "PhD in Economics, Chicago Booth",
      bio: "Financial economist with expertise in market microstructure and behavioral finance. Former Federal Reserve researcher and academic with 30+ publications.",
      achievements: [
        "Former Fed researcher",
        "30+ academic publications",
        "NBER research associate"
      ],
      image: "/api/placeholder/300/300",
      social: {
        linkedin: "https://linkedin.com/in/alexkim",
        twitter: "https://twitter.com/alexkim_research"
      }
    },
    {
      name: "Lisa Wang",
      role: "Product Manager",
      expertise: ["Product Strategy", "User Experience", "Financial Technology"],
      experience: "9+ years",
      education: "MBA, Harvard Business School",
      bio: "Product leader with extensive experience in fintech and trading platforms. Former Bloomberg product manager with deep understanding of trader workflows and needs.",
      achievements: [
        "Former Bloomberg product manager",
        "Led 3 successful fintech launches",
        "Expert in trader UX design"
      ],
      image: "/api/placeholder/300/300",
      social: {
        linkedin: "https://linkedin.com/in/lisawang",
        twitter: "https://twitter.com/lisawang_pm"
      }
    }
  ];

  const advisors = [
    {
      name: "Prof. Robert Miller",
      role: "Academic Advisor",
      title: "Professor of Finance, Harvard Business School",
      expertise: "Behavioral Finance, Market Efficiency",
      bio: "Leading academic in behavioral finance with 40+ years of research experience. Advisor to multiple hedge funds and institutional investors."
    },
    {
      name: "David Park",
      role: "Industry Advisor",
      title: "Former CEO, Two Sigma Investments",
      expertise: "Quantitative Investing, Technology",
      bio: "Former CEO of Two Sigma with deep expertise in quantitative investing and technology infrastructure for financial markets."
    },
    {
      name: "Dr. Maria Gonzalez",
      role: "Regulatory Advisor",
      title: "Former SEC Commissioner",
      expertise: "Financial Regulation, Compliance",
      bio: "Former SEC commissioner with extensive experience in financial regulation and market oversight. Expert in regulatory compliance and risk management."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Meet Our Team
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            World-class experts in quantitative finance, AI, and trading technology, 
            united by a passion for democratizing sophisticated market analysis.
          </p>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 mb-2">6</div>
              <div className="text-sm text-gray-600">Core Team Members</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Award className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 mb-2">80+</div>
              <div className="text-sm text-gray-600">Years Combined Experience</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <BookOpen className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 mb-2">50+</div>
              <div className="text-sm text-gray-600">Academic Publications</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <TrendingUp className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 mb-2">$5B+</div>
              <div className="text-sm text-gray-600">Assets Previously Managed</div>
            </CardContent>
          </Card>
        </div>

        {/* Core Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Core Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users className="h-8 w-8 text-gray-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <p className="text-sm text-gray-600">{member.role}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Expertise</h4>
                      <div className="flex flex-wrap gap-2">
                        {member.expertise.map((skill, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Experience</h4>
                      <p className="text-sm text-gray-600">{member.experience}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Education</h4>
                      <p className="text-sm text-gray-600">{member.education}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Bio</h4>
                      <p className="text-sm text-gray-600">{member.bio}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Key Achievements</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {member.achievements.map((achievement, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <Award className="h-3 w-3 text-green-600" />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      {member.social.linkedin && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {member.social.twitter && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={member.social.twitter} target="_blank" rel="noopener noreferrer">
                            <Twitter className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {member.social.github && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={member.social.github} target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Advisory Board */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Advisory Board
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {advisors.map((advisor, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{advisor.name}</CardTitle>
                  <p className="text-sm text-gray-600">{advisor.role}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">Title</h4>
                      <p className="text-sm text-gray-600">{advisor.title}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">Expertise</h4>
                      <p className="text-sm text-gray-600">{advisor.expertise}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">Background</h4>
                      <p className="text-sm text-gray-600">{advisor.bio}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Company Culture */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Our Culture & Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Innovation</h3>
                <p className="text-sm text-gray-600">
                  Constantly pushing the boundaries of what&apos;s possible in financial analysis.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Integrity</h3>
                <p className="text-sm text-gray-600">
                  Transparent, honest, and ethical in all our research and recommendations.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <BarChart3 className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Excellence</h3>
                <p className="text-sm text-gray-600">
                  Rigorous methodology and highest standards in everything we do.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Globe className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Impact</h3>
                <p className="text-sm text-gray-600">
                  Making sophisticated analysis accessible to traders worldwide.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Join Us */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Join Our Mission
              </h3>
              <p className="text-gray-600 mb-6">
                We&apos;re always looking for exceptional talent to join our team. 
                If you&apos;re passionate about quantitative finance, AI, or trading technology, 
                we&apos;d love to hear from you.
              </p>
              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <a href="mailto:careers@marketbias.com">View Open Positions</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="mailto:hello@marketbias.com">Get in Touch</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
