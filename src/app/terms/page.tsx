'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from '@/components/Navigation';
import { 
  Shield, 
  AlertTriangle, 
  DollarSign, 
  FileText,
  Users,
  Clock,
  CheckCircle
} from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600">
            Legal terms and conditions for using Daily Bias India platform
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Last updated: January 2024
          </div>
        </div>

        {/* Regulatory Status */}
        <Card className="mb-8 bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <Shield className="h-6 w-6" />
              Regulatory Status & Limitations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-red-800">
              <div>
                <strong>Important Regulatory Notice:</strong>
                <p className="mt-2">
                  Daily Bias India operates as an <strong>educational and informational service</strong>, 
                  <strong>not as a regulated financial advisor or investment manager</strong>. 
                  We are <strong>not registered with SEBI, SEC, or any financial regulatory authority</strong>.
                </p>
              </div>
              
              <div>
                <strong>No Regulatory Oversight:</strong>
                <p className="mt-2">
                  This means there is <strong>no regulatory oversight</strong> of our services, methodologies, or claims. 
                  Users must conduct their own due diligence and verify all information independently.
                </p>
              </div>
              
              <div>
                <strong>User Responsibility:</strong>
                <p className="mt-2">
                  <strong>YOU ARE SOLELY RESPONSIBLE</strong> for your own due diligence, risk assessment, and trading decisions. 
                  We provide educational information only and do not provide investment advice.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Description */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-600" />
              Service Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <strong>What We Provide:</strong>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Educational market analysis and bias signals</li>
                  <li>Transparent methodology and calculation methods</li>
                  <li>Historical performance data (for educational purposes)</li>
                  <li>Market news and sentiment analysis</li>
                  <li>Technical analysis tools and indicators</li>
                </ul>
              </div>
              
              <div>
                <strong>What We Do NOT Provide:</strong>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Investment advice or recommendations</li>
                  <li>Guaranteed trading results or profits</li>
                  <li>Regulated financial advisory services</li>
                  <li>Personalized investment strategies</li>
                  <li>Financial planning or portfolio management</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monetization & Refund Policy */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-green-600" />
              Monetization & Refund Policy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <strong>Current Status:</strong>
                <p className="mt-2">
                  The platform is currently <strong>free to use</strong> for educational purposes. 
                  If we introduce paid subscriptions, signals, or premium features in the future, the following terms will apply:
                </p>
              </div>
              
              <div>
                <strong>Refund Policy (Future Paid Services):</strong>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li><strong>30-day money-back guarantee</strong> for all paid subscriptions</li>
                  <li>Refunds processed within 5-7 business days</li>
                  <li>No questions asked for first-time subscribers</li>
                  <li>Pro-rated refunds for annual subscriptions</li>
                  <li>Contact support@dailybias.in for refund requests</li>
                </ul>
              </div>
              
              <div>
                <strong>Claims Substantiation:</strong>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>All performance claims are independently audited</li>
                  <li>Real-time performance tracking with public audit trails</li>
                  <li>Methodology is open-source and auditable</li>
                  <li>Third-party verification of all user testimonials</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Responsibilities */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6 text-purple-600" />
              User Responsibilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <strong>Due Diligence Requirements:</strong>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Verify all claims independently with trusted sources</li>
                  <li>Cross-check performance data with multiple sources</li>
                  <li>Understand the methodology and its limitations</li>
                  <li>Assess your own risk tolerance and financial situation</li>
                  <li>Consult with qualified financial advisors</li>
                </ul>
              </div>
              
              <div>
                <strong>Risk Management:</strong>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Never risk more than you can afford to lose</li>
                  <li>Use appropriate position sizing and risk controls</li>
                  <li>Diversify your investments and strategies</li>
                  <li>Keep detailed records of your trading decisions</li>
                  <li>Regularly review and adjust your risk management</li>
                </ul>
              </div>
              
              <div>
                <strong>Educational Use Only:</strong>
                <p className="mt-2">
                  This platform is for <strong>educational purposes only</strong>. All information should be used 
                  as a learning tool alongside your own research and analysis.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimers */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
              Important Disclaimers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <strong>No Investment Advice:</strong>
                <p className="mt-2">
                  Nothing on this platform constitutes investment advice, financial advice, trading advice, 
                  or any other sort of advice. All information is for educational purposes only.
                </p>
              </div>
              
              <div>
                <strong>No Guarantees:</strong>
                <p className="mt-2">
                  We make no guarantees about the accuracy, completeness, or timeliness of any information. 
                  Past performance does not guarantee future results.
                </p>
              </div>
              
              <div>
                <strong>Market Risks:</strong>
                <p className="mt-2">
                  Trading involves substantial risk of loss and is not suitable for all investors. 
                  You should carefully consider your investment objectives and risk tolerance.
                </p>
              </div>
              
              <div>
                <strong>Data Limitations:</strong>
                <p className="mt-2">
                  While we strive for accuracy, data may be delayed, incomplete, or differ from other sources. 
                  We cannot guarantee uninterrupted availability or accuracy.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Limitation of Liability */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-red-600" />
              Limitation of Liability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <strong>No Liability for Trading Losses:</strong>
                <p className="mt-2">
                  We are not liable for any trading losses, investment losses, or financial damages resulting 
                  from the use of this platform or its information.
                </p>
              </div>
              
              <div>
                <strong>Use at Your Own Risk:</strong>
                <p className="mt-2">
                  You use this platform and its information at your own risk. We disclaim all warranties 
                  and assume no responsibility for your trading decisions or outcomes.
                </p>
              </div>
              
              <div>
                <strong>Maximum Liability:</strong>
                <p className="mt-2">
                  Our maximum liability for any claims related to this platform shall not exceed the amount 
                  you paid for the service (currently $0 as the service is free).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-6 w-6 text-blue-600" />
              Contact & Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <strong>Questions or Concerns:</strong>
                <p className="mt-2">
                  If you have questions about these terms or need support, contact us at:
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Email: support@dailybias.in</li>
                  <li>Response time: 24-48 hours</li>
                  <li>Business hours: Monday-Friday, 9 AM - 6 PM IST</li>
                </ul>
              </div>
              
              <div>
                <strong>Terms Updates:</strong>
                <p className="mt-2">
                  We may update these terms from time to time. We will notify users of significant changes 
                  via email or platform notification.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Acceptance */}
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-6 w-6" />
              Terms Acceptance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-green-800">
              <p className="mb-4">
                <strong>By using this platform, you acknowledge that you have read, understood, and agree to these terms.</strong>
              </p>
              <p>
                You understand that this is an educational service with no regulatory oversight, and you are responsible 
                for your own due diligence and risk management.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
