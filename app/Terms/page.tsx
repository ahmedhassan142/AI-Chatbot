// app/terms/page.tsx
import { Metadata } from 'next';
import { 
  FileText, 
  Scale, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Shield, 
  Zap,
  Mail,
  Globe,
  Users,
  Database,
  Lock,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | ERP AI Assistant',
  description: 'Terms and conditions for using our ERP AI Assistant service',
};

export default function TermsOfServicePage() {
  const effectiveDate = 'April 16, 2026';

  const sections = [
    {
      icon: FileText,
      title: '1. Acceptance of Terms',
      content: [
        'By accessing or using ERP AI Assistant, you agree to be bound by these Terms of Service.',
        'If you do not agree to these terms, please do not use our service.',
        'We reserve the right to update these terms at any time. Continued use constitutes acceptance.',
        'Using the service means you are at least 13 years old (or 16 in certain jurisdictions).'
      ]
    },
    {
      icon: Users,
      title: '2. User Accounts & Authentication',
      content: [
        'You are responsible for maintaining the confidentiality of your account credentials.',
        'You must provide accurate and complete registration information.',
        'You are responsible for all activities that occur under your account.',
        'Guest users have limited functionality and temporary data retention.',
        'We reserve the right to suspend or terminate accounts for violations.',
        'Multiple accounts per user are not permitted without prior approval.'
      ]
    },
    {
      icon: Activity,
      title: '3. Acceptable Use Policy',
      content: [
        'Do not use the service for illegal activities or to violate any laws.',
        'Do not upload malicious code, viruses, or harmful content.',
        'Do not attempt to bypass rate limits or security measures.',
        'Do not use the service to generate spam, harassment, or hate speech.',
        'Do not reverse engineer or extract the underlying AI models.',
        'Respect intellectual property rights of others.',
        'Do not share API keys or authentication tokens publicly.'
      ]
    },
    {
      icon: Database,
      title: '4. Data & Privacy',
      content: [
        'Your conversations are processed by our AI models and may be used to improve service quality.',
        'We do not sell your personal data to third parties.',
        'You retain ownership of your input content.',
        'We own the AI-generated responses and aggregated analytics.',
        'Guest sessions are automatically deleted after 30 days of inactivity.',
        'For full details, review our Privacy Policy.',
        'You may request data export or deletion at any time.'
      ]
    },
    {
      icon: Zap,
      title: '5. Service Availability & Limitations',
      content: [
        'We strive for 99.9% uptime but do not guarantee uninterrupted service.',
        'Rate limits apply: 30 requests per minute for free tier.',
        'AI responses may contain errors or inaccuracies.',
        'We may deprecate features or models with reasonable notice.',
        'Maintenance windows may cause temporary service interruptions.',
        'Response times vary based on model complexity and load.'
      ]
    },
    {
      icon: Lock,
      title: '6. Security',
      content: [
        'We implement industry-standard security measures to protect your data.',
        'You are responsible for securing your own devices and network.',
        'Report security vulnerabilities to security@erpaiassistant.com',
        'We encrypt data in transit (TLS 1.3+) and at rest.',
        'Access logs are maintained for security auditing.',
        'Suspicious activity may trigger automatic account suspension.'
      ]
    },
    {
      icon: Scale,
      title: '7. Limitation of Liability',
      content: [
        'The service is provided "as is" without warranties of any kind.',
        'We are not liable for any indirect, incidental, or consequential damages.',
        'Our total liability is limited to the amount you paid us (if any).',
        'We are not responsible for decisions made based on AI responses.',
        'You assume all risks associated with using the service.',
        'Some jurisdictions do not allow liability limitations, so exceptions may apply.'
      ]
    },
    {
      icon: AlertCircle,
      title: '8. Termination',
      content: [
        'You may terminate your account at any time via settings.',
        'We may suspend or terminate accounts for violations of these terms.',
        'Upon termination, your data may be deleted after 30 days.',
        'Prohibited conduct waives your right to data export.',
        'Sections regarding liability and intellectual property survive termination.'
      ]
    }
  ];

  const prohibitedActions = [
    "Illegal activities or promoting violence",
    "Harassment, abuse, or hate speech",
    "Generating misleading or false information",
    "Impersonating others without consent",
    "Automated scraping or data mining",
    "Sharing explicit or harmful content",
    "Attempting to manipulate AI responses maliciously"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
              <Scale className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Effective: {effectiveDate}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Please read these terms carefully before using our service.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild variant="default">
                <Link href="#summary">Quick Summary</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="#terms">Full Terms</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/privacy">Privacy Policy</Link>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Summary Card */}
          <Card id="summary" className="mb-12 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Terms at a Glance
              </CardTitle>
              <CardDescription>
                Key things you should know before using our service
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">What you CAN do</span>
                  </div>
                  <ul className="space-y-2 pl-6">
                    <li className="text-sm text-muted-foreground">✓ Use AI for business productivity</li>
                    <li className="text-sm text-muted-foreground">✓ Save and export your conversations</li>
                    <li className="text-sm text-muted-foreground">✓ Request data deletion anytime</li>
                    <li className="text-sm text-muted-foreground">✓ Use guest mode without account</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-red-600">
                    <XCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">What you CANNOT do</span>
                  </div>
                  <ul className="space-y-2 pl-6">
                    <li className="text-sm text-muted-foreground">✗ Use for illegal activities</li>
                    <li className="text-sm text-muted-foreground">✗ Scrape or data mine the service</li>
                    <li className="text-sm text-muted-foreground">✗ Share API keys publicly</li>
                    <li className="text-sm text-muted-foreground">✗ Bypass rate limits or security</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prohibited Actions Section */}
          <Card className="mb-8 border-red-200 bg-red-50/50 dark:bg-red-950/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                <AlertCircle className="h-5 w-5" />
                Strictly Prohibited Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3">
                {prohibitedActions.map((action, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <span className="text-sm">{action}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Full Terms Sections */}
          <div id="terms" className="space-y-6">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle>{section.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-3">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary/60 mt-2" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Disclaimer */}
          <Card className="mt-8 bg-yellow-50/30 dark:bg-yellow-950/10 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-yellow-800 dark:text-yellow-400">Disclaimer of Warranties</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                ERP AI Assistant is provided for informational and productivity purposes only. 
                AI-generated responses may contain errors, inaccuracies, or outdated information. 
                You should verify critical information before making business decisions. 
                We are not responsible for any losses or damages resulting from reliance on AI responses.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">
                For questions about these terms or to report violations:
              </p>
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>Legal: legal@erpaiassistant.com</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>Abuse Reports: abuse@erpaiassistant.com</span>
                </p>
                <p className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />
                  <span>Website: https://erpaiassistant.com/terms</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <div className="text-center text-xs text-muted-foreground mt-8 pt-8 border-t">
            <p>
              These terms are governed by the laws of [Your State/Country], without regard to conflict of law principles.
              Any disputes shall be resolved through binding arbitration in [Your City, State].
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}