// app/dashboard/help/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Search,
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  FileText,
  Eye,
  Send,
  Video,
  BookOpen,
  Users,
  Rocket,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
  Download,
  ExternalLink,
} from 'lucide-react';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  // FAQ Categories
  const faqCategories = [
    { id: 'all', name: 'All Topics', count: 25, icon: HelpCircle },
    { id: 'getting-started', name: 'Getting Started', count: 8, icon: Rocket },
    { id: 'account', name: 'Account & Billing', count: 5, icon: Users },
    { id: 'features', name: 'Features & Usage', count: 7, icon: BookOpen },
    { id: 'troubleshooting', name: 'Troubleshooting', count: 5, icon: AlertCircle },
  ];

  // FAQ Data
  const faqs = [
    {
      id: '1',
      question: 'How do I reset my password?',
      answer: 'To reset your password, go to Settings > Security > Change Password. Enter your current password and your new password twice. Make sure your new password is at least 8 characters long and includes a mix of letters, numbers, and symbols.',
      category: 'account',
      views: 1245,
      helpful: 98,
    },
    {
      id: '2',
      question: 'How can I add new users to my team?',
      answer: 'As an admin, you can add new users by going to the Users page and clicking "Add User". Fill in the user\'s details and assign them a role. They will receive an email invitation to join your team.',
      category: 'features',
      views: 892,
      helpful: 87,
    },
    {
      id: '3',
      question: 'How do I generate reports?',
      answer: 'Navigate to the Reports page and select the type of report you want to generate. Choose your date range and filters, then click "Generate Report". You can export reports in PDF, Excel, or CSV format.',
      category: 'features',
      views: 756,
      helpful: 92,
    },
    {
      id: '4',
      question: 'Can I integrate with other tools?',
      answer: 'Yes, we support integrations with popular tools via our API. Go to Settings > Integrations to connect with tools like Slack, Google Workspace, and Microsoft Teams. API documentation is available in the Developer section.',
      category: 'features',
      views: 543,
      helpful: 85,
    },
    {
      id: '5',
      question: 'How do I upgrade my plan?',
      answer: 'To upgrade your plan, go to Settings > Billing > Upgrade Plan. Select the plan that fits your needs and follow the payment process. Your new features will be available immediately.',
      category: 'account',
      views: 432,
      helpful: 76,
    },
    {
      id: '6',
      question: 'Why is my dashboard loading slowly?',
      answer: 'Slow loading can be caused by several factors: 1) Clear your browser cache, 2) Check your internet connection, 3) Try using a different browser, 4) Contact support if the issue persists with details about your browser and network.',
      category: 'troubleshooting',
      views: 321,
      helpful: 65,
    },
    {
      id: '7',
      question: 'How do I set up two-factor authentication?',
      answer: 'Go to Settings > Security > Two-Factor Authentication. Click "Enable 2FA" and follow the setup instructions using an authenticator app like Google Authenticator or Authy.',
      category: 'account',
      views: 298,
      helpful: 91,
    },
    {
      id: '8',
      question: 'Can I export my data?',
      answer: 'Yes, you can export your data in multiple formats. Go to Settings > Advanced > Data Export. Select the data range and format (JSON, CSV, or Excel), then click "Export Data".',
      category: 'features',
      views: 267,
      helpful: 88,
    },
  ];

  // Tutorials
  const tutorials = [
    {
      id: '1',
      title: 'Getting Started with Dashboard',
      description: 'Learn the basics of navigating and using the dashboard',
      duration: '5 min',
      category: 'getting-started',
      type: 'video',
      views: '1.2K',
    },
    {
      id: '2',
      title: 'Advanced Analytics Guide',
      description: 'Master data analysis with our comprehensive analytics tools',
      duration: '15 min',
      category: 'features',
      type: 'article',
      views: '845',
    },
    {
      id: '3',
      title: 'User Management Tutorial',
      description: 'Learn how to manage team members and permissions',
      duration: '8 min',
      category: 'features',
      type: 'video',
      views: '723',
    },
    {
      id: '4',
      title: 'API Integration Guide',
      description: 'Step-by-step guide to integrating with our API',
      duration: '12 min',
      category: 'features',
      type: 'article',
      views: '512',
    },
    {
      id: '5',
      title: 'Security Best Practices',
      description: 'Learn how to secure your account and data',
      duration: '10 min',
      category: 'account',
      type: 'video',
      views: '498',
    },
  ];

  // Contact methods
  const contactMethods = [
    {
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      icon: MessageSquare,
      responseTime: '2-5 min',
      available: true,
      action: 'Start Chat',
    },
    {
      title: 'Email Support',
      description: 'Send us an email and we\'ll respond within 24 hours',
      icon: Mail,
      responseTime: '24 hours',
      available: true,
      action: 'Send Email',
    },
    {
      title: 'Phone Support',
      description: 'Call us during business hours (9 AM - 6 PM EST)',
      icon: Phone,
      responseTime: '15 min',
      available: true,
      action: 'Call Now',
    },
    {
      title: 'Schedule a Call',
      description: 'Book a 1-on-1 session with our experts',
      icon: Video,
      responseTime: '1-2 days',
      available: true,
      action: 'Schedule',
    },
  ];

  // Support tickets
  const supportTickets = [
    {
      id: 'TKT-001',
      subject: 'Cannot access dashboard',
      status: 'resolved',
      priority: 'high',
      createdAt: '2 hours ago',
      updatedAt: '1 hour ago',
    },
    {
      id: 'TKT-002',
      subject: 'Report generation issue',
      status: 'in-progress',
      priority: 'medium',
      createdAt: '1 day ago',
      updatedAt: '2 hours ago',
    },
    {
      id: 'TKT-003',
      subject: 'Billing question',
      status: 'open',
      priority: 'low',
      createdAt: '3 days ago',
      updatedAt: '3 days ago',
    },
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketSubmitted(true);
    setTimeout(() => setTicketSubmitted(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
          <p className="text-muted-foreground">
            Get help, documentation, and contact our support team
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            Documentation
          </Button>
          <Button className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Contact Support
          </Button>
        </div>
      </div>

      {/* Quick Support Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {contactMethods.map((method, index) => {
          const Icon = method.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg ${method.available ? 'bg-primary/10' : 'bg-muted'}`}>
                    <Icon className={`h-6 w-6 ${method.available ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  {method.available && (
                    <Badge variant="outline" className="bg-green-500/20 text-green-700">
                      Available
                    </Badge>
                  )}
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold text-lg">{method.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{method.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {method.responseTime}
                    </div>
                    <Button size="sm" variant={method.available ? "default" : "outline"}>
                      {method.action}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search for help articles, tutorials, or FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Badge variant="outline">
                {filteredFaqs.length} results
              </Badge>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-sm text-muted-foreground">Popular searches:</span>
            {['password reset', 'user management', 'reports', 'billing', 'API'].map((term, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="h-7"
                onClick={() => setSearchQuery(term)}
              >
                {term}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList>
          <TabsTrigger value="faq" className="gap-2">
            <HelpCircle className="h-4 w-4" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="tutorials" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Tutorials
          </TabsTrigger>
          <TabsTrigger value="tickets" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            My Tickets
          </TabsTrigger>
          <TabsTrigger value="contact" className="gap-2">
            <Mail className="h-4 w-4" />
            Contact Us
          </TabsTrigger>
        </TabsList>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          {/* FAQ Categories */}
          <div className="flex flex-wrap gap-2">
            {faqCategories.map(category => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  className="gap-2"
                  onClick={() => setActiveCategory(category.id)}
                >
                  <Icon className="h-4 w-4" />
                  {category.name}
                  <Badge variant="secondary" className="ml-2">
                    {category.count}
                  </Badge>
                </Button>
              );
            })}
          </div>

          {/* FAQ Accordion */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Find answers to common questions about using our platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {filteredFaqs.map(faq => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center justify-between w-full pr-4">
                        <span className="font-medium">{faq.question}</span>
                        <Badge variant="outline" className="ml-2">
                          {faq.category}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <p className="text-muted-foreground">{faq.answer}</p>
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {faq.views.toLocaleString()} views
                            </span>
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3" />
                              {faq.helpful}% found this helpful
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-8 gap-1">
                              <ThumbsUp className="h-3 w-3" />
                              Helpful
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 gap-1">
                              <ThumbsDown className="h-3 w-3" />
                              Not Helpful
                            </Button>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tutorials Tab */}
        <TabsContent value="tutorials" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorials.map(tutorial => (
              <Card key={tutorial.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${tutorial.type === 'video' ? 'bg-blue-500/10' : 'bg-green-500/10'}`}>
                      {tutorial.type === 'video' ? (
                        <Video className="h-6 w-6 text-blue-600" />
                      ) : (
                        <FileText className="h-6 w-6 text-green-600" />
                      )}
                    </div>
                    <Badge variant="outline">
                      {tutorial.duration}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{tutorial.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{tutorial.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {tutorial.views}
                      </span>
                      <Badge variant="secondary" className="capitalize">
                        {tutorial.category}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1">
                      View
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Documentation Links */}
          <Card>
            <CardHeader>
              <CardTitle>Documentation & Guides</CardTitle>
              <CardDescription>
                Comprehensive guides and API documentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10">
                      <BookOpen className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Getting Started Guide</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Complete guide to setting up and using the platform
                      </p>
                      <Button variant="link" className="px-0 mt-2 gap-1">
                        Read Guide
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/10">
                      <FileText className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">API Documentation</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Complete API reference and integration guides
                      </p>
                      <Button variant="link" className="px-0 mt-2 gap-1">
                        View Docs
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Tickets Tab */}
        <TabsContent value="tickets" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Support Tickets</h2>
              <p className="text-muted-foreground">Track and manage your support requests</p>
            </div>
            <Button className="gap-2">
              <MessageSquare className="h-4 w-4" />
              New Ticket
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium">Ticket ID</th>
                      <th className="text-left p-4 font-medium">Subject</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Priority</th>
                      <th className="text-left p-4 font-medium">Created</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supportTickets.map(ticket => (
                      <tr key={ticket.id} className="border-b hover:bg-muted/50">
                        <td className="p-4">
                          <code className="bg-muted px-2 py-1 rounded text-sm">{ticket.id}</code>
                        </td>
                        <td className="p-4 font-medium">{ticket.subject}</td>
                        <td className="p-4">
                          <Badge
                            variant={
                              ticket.status === 'resolved' ? 'default' :
                              ticket.status === 'in-progress' ? 'secondary' : 'outline'
                            }
                            className={
                              ticket.status === 'resolved' ? 'bg-green-500/20 text-green-700' :
                              ticket.status === 'in-progress' ? 'bg-blue-500/20 text-blue-700' : ''
                            }
                          >
                            {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge
                            variant="outline"
                            className={
                              ticket.priority === 'high' ? 'bg-red-500/20 text-red-700' :
                              ticket.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-700' :
                              'bg-green-500/20 text-green-700'
                            }
                          >
                            {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">{ticket.createdAt}</td>
                        <td className="p-4">
                          <Button variant="ghost" size="sm">View</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* New Ticket Form */}
          <Card>
            <CardHeader>
              <CardTitle>Submit New Ticket</CardTitle>
              <CardDescription>
                Describe your issue and we'll get back to you as soon as possible
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Brief description of your issue"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Technical Issue</SelectItem>
                        <SelectItem value="billing">Billing & Account</SelectItem>
                        <SelectItem value="feature">Feature Request</SelectItem>
                        <SelectItem value="bug">Bug Report</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High (Urgent)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Please provide detailed information about your issue..."
                    rows={6}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="attachment">Attachments</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag & drop files here or click to upload
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Supports images, PDFs, and documents up to 10MB
                    </p>
                    <Button variant="outline" type="button" className="gap-2">
                      <Upload className="h-4 w-4" />
                      Choose Files
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 inline mr-1" />
                    We typically respond within 24 hours
                  </div>
                  <Button type="submit" className="gap-2">
                    {ticketSubmitted ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Ticket Submitted!
                      </>
                    ) : (
                      <>
                        <MessageSquare className="h-4 w-4" />
                        Submit Ticket
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Us Tab */}
        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Get in touch with our support team
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Email</h4>
                      <p className="text-sm text-muted-foreground">support@erpsystem.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <Phone className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Phone</h4>
                      <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <Clock className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Business Hours</h4>
                      <p className="text-sm text-muted-foreground">
                        Monday - Friday: 9 AM - 6 PM EST
                        <br />
                        Saturday - Sunday: 10 AM - 4 PM EST
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10">
                      <MapPin className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Office Location</h4>
                      <p className="text-sm text-muted-foreground">
                        123 Business St, Suite 100
                        <br />
                        San Francisco, CA 94107
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Emergency Support</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    For critical system outages or security issues, contact our emergency line:
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-red-700">
                      <AlertCircle className="h-5 w-5" />
                      <span className="font-semibold">Emergency Hotline: +1 (555) 911-9111</span>
                    </div>
                    <p className="text-sm text-red-600 mt-2">
                      Available 24/7 for critical issues only
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Send Us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you shortly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="your@email.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="How can we help you?"
                      rows={4}
                    />
                  </div>
                  <Button type="submit" className="w-full gap-2">
                    <Send className="h-4 w-4" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Community & Resources */}
          <Card>
            <CardHeader>
              <CardTitle>Community & Resources</CardTitle>
              <CardDescription>
                Join our community and access additional resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
                  <div className="p-3 rounded-lg bg-blue-500/10 w-fit mb-4">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Community Forum</h3>
                  <p className="text-muted-foreground mb-4">
                    Connect with other users, ask questions, and share knowledge
                  </p>
                  <Button variant="outline" className="w-full">
                    Join Community
                  </Button>
                </div>
                <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
                  <div className="p-3 rounded-lg bg-green-500/10 w-fit mb-4">
                    <BookOpen className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Knowledge Base</h3>
                  <p className="text-muted-foreground mb-4">
                    Comprehensive documentation and how-to guides
                  </p>
                  <Button variant="outline" className="w-full gap-2">
                    <Download className="h-4 w-4" />
                    Download Guides
                  </Button>
                </div>
                <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
                  <div className="p-3 rounded-lg bg-purple-500/10 w-fit mb-4">
                    <Video className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Video Tutorials</h3>
                  <p className="text-muted-foreground mb-4">
                    Watch step-by-step video guides and tutorials
                  </p>
                  <Button variant="outline" className="w-full gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Watch Videos
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Add missing components
function Label({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
      {children}
    </label>
  );
}

function Upload({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  );
}

function MapPin({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}