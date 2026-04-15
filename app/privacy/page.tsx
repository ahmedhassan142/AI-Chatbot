// app/privacy/page.tsx
import { Metadata } from 'next';
import { Shield, Lock, Database, Eye, Trash2, Cookie, Mail, Globe } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | ERP AI Assistant',
  description: 'Learn how we collect, use, and protect your data when using our ERP AI Assistant',
};

export default function PrivacyPolicyPage() {
  const lastUpdated = 'April 16, 2026';
  
  const sections = [
    {
      icon: Database,
      title: 'Information We Collect',
      content: [
        'Account Information: Name, email address, role, department, and authentication credentials',
        'Conversation Data: Chat messages, queries, responses, and interaction history',
        'Usage Data: Feature usage, response times, session duration, and performance metrics',
        'Technical Data: IP address, browser type, device information, and access timestamps',
        'Business Data: Sales analytics, customer support tickets, task management data'
      ]
    },
    {
      icon: Lock,
      title: 'How We Use Your Information',
      content: [
        'Provide and improve AI chat responses and ERP assistance',
        'Personalize user experience based on role and department',
        'Analyze usage patterns to enhance service quality',
        'Generate analytics and business intelligence reports',
        'Maintain security and prevent fraud or abuse',
        'Comply with legal obligations and enforce our terms'
      ]
    },
    {
      icon: Eye,
      title: 'Data Sharing & Disclosure',
      content: [
        'We do not sell your personal information to third parties',
        'AI processing: Your messages are sent to Groq API for generating responses',
        'Service providers: Limited data sharing with hosting, analytics, and security partners',
        'Legal requirements: When required by law or to protect rights and safety',
        'Business transfers: In case of merger or acquisition with notice'
      ]
    },
    {
      icon: Trash2,
      title: 'Data Retention',
      content: [
        'Authenticated users: Conversations stored until account deletion',
        'Guest users: Temporary sessions expire after 30 days of inactivity',
        'Usage logs: Retained for 12 months for security and analytics',
        'You can request data deletion at any time via account settings'
      ]
    },
    {
      icon: Cookie,
      title: 'Cookies & Tracking',
      content: [
        'Essential cookies: Required for authentication and session management',
        'Preference cookies: Remember your department filters and UI settings',
        'Analytics cookies: Anonymous usage tracking to improve performance',
        'You can disable cookies in browser settings, but some features may break'
      ]
    },
    {
      icon: Shield,
      title: 'Data Security',
      content: [
        'End-to-end encryption for all API communications',
        'Secure authentication with JWT tokens and HTTP-only cookies',
        'Regular security audits and penetration testing',
        'Access controls and role-based permissions',
        'Data encrypted at rest and in transit (TLS 1.3)'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Last Updated: {lastUpdated}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Your trust is our priority. Learn how we protect your data.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild variant="default">
                <Link href="#summary">Quick Summary</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="#details">Full Policy</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Quick Summary Card */}
          <Card id="summary" className="mb-12 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Privacy at a Glance
              </CardTitle>
              <CardDescription>
                Key points about how we handle your information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
                  <p className="text-sm">We never sell your personal data</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
                  <p className="text-sm">You can export or delete your data anytime</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
                  <p className="text-sm">AI responses are processed securely via Groq API</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
                  <p className="text-sm">Guest sessions expire automatically after 30 days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Full Policy Sections */}
          <div id="details" className="space-y-8">
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
                    <ul className="space-y-3">
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

          {/* Your Rights Section */}
          <Card className="mt-8 bg-muted/30">
            <CardHeader>
              <CardTitle>Your Data Protection Rights</CardTitle>
              <CardDescription>
                Under GDPR, CCPA, and other privacy laws
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">You have the right to:</h4>
                  <ul className="space-y-2">
                    <li className="text-sm text-muted-foreground">✓ Access your personal data</li>
                    <li className="text-sm text-muted-foreground">✓ Correct inaccurate information</li>
                    <li className="text-sm text-muted-foreground">✓ Delete your data (Right to be forgotten)</li>
                    <li className="text-sm text-muted-foreground">✓ Restrict or object to processing</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">To exercise your rights:</h4>
                  <ul className="space-y-2">
                    <li className="text-sm text-muted-foreground">• Email: privacy@erpaiassistant.com</li>
                    <li className="text-sm text-muted-foreground">• Through account settings dashboard</li>
                    <li className="text-sm text-muted-foreground">• Response within 30 days</li>
                    <li className="text-sm text-muted-foreground">• No discrimination for exercising rights</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Contact Us About Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">
                If you have questions about this privacy policy or our data practices, please contact us:
              </p>
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>Email: privacy@erpaiassistant.com</span>
                </p>
                <p className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />
                  <span>Website: https://erpaiassistant.com/privacy</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}