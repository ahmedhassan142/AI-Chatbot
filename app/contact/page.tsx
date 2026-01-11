// app/contact/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2,
  MessageSquare,
  User,
  Building,
  Globe,
  Linkedin,
  Twitter,
  Facebook,
  Instagram
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    department: 'general',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const departments = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'sales', label: 'Sales' },
    { value: 'support', label: 'Technical Support' },
    { value: 'billing', label: 'Billing' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'careers', label: 'Careers' }
  ];

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      content: 'hello@erpsystem.com',
      description: 'General inquiries',
      badge: '24h response'
    },
    {
      icon: Phone,
      title: 'Phone',
      content: '+1 (555) 123-4567',
      description: 'Mon-Fri 9AM-6PM EST',
      badge: 'Support'
    },
    {
      icon: MapPin,
      title: 'Office',
      content: '123 Business Street',
      description: 'San Francisco, CA 94107',
      badge: 'HQ'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      content: 'Monday - Friday',
      description: '9:00 AM - 6:00 PM EST',
      badge: 'Online'
    }
  ];

  const socialLinks = [
    { icon: Twitter, label: 'Twitter', href: 'https://twitter.com/erpsystem' },
    { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com/company/erpsystem' },
    { icon: Facebook, label: 'Facebook', href: 'https://facebook.com/erpsystem' },
    { icon: Instagram, label: 'Instagram', href: 'https://instagram.com/erpsystem' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setIsSubmitting(false);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        subject: '',
        department: 'general',
        message: ''
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 px-4 py-1.5 text-sm">
            Get in Touch
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            We're Here to <span className="text-primary">Help</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Have questions about our ERP solutions? Our team is ready to assist you with implementation, support, and partnership opportunities.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((item, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{item.title}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {item.badge}
                      </Badge>
                    </div>
                    <p className="font-medium text-lg mb-1">{item.content}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <MessageSquare className="h-6 w-6" />
                  Send us a Message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and our team will get back to you within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold mb-3">Message Sent!</h3>
                    <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                      Thank you for reaching out. Our team will contact you shortly.
                    </p>
                    <Button onClick={() => setIsSubmitted(false)}>
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@company.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="company" className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          Company
                        </Label>
                        <Input
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Your Company Inc."
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="How can we help?"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Select 
                          value={formData.department} 
                          onValueChange={(value) => handleSelectChange('department', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((dept) => (
                              <SelectItem key={dept.value} value={dept.value}>
                                {dept.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Your Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Please describe your inquiry in detail..."
                        rows={6}
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full gap-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>Sending...</>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Get Support</CardTitle>
                <CardDescription>
                  Quick access to help resources
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <Globe className="h-4 w-4" />
                  <div className="text-left">
                    <p className="font-medium">Knowledge Base</p>
                    <p className="text-xs text-muted-foreground">Browse our documentation</p>
                  </div>
                </Button>
                
                <Button variant="outline" className="w-full justify-start gap-3">
                  <MessageSquare className="h-4 w-4" />
                  <div className="text-left">
                    <p className="font-medium">Live Chat</p>
                    <p className="text-xs text-muted-foreground">Chat with support team</p>
                  </div>
                </Button>
                
                <Button variant="outline" className="w-full justify-start gap-3">
                  <Phone className="h-4 w-4" />
                  <div className="text-left">
                    <p className="font-medium">Schedule a Call</p>
                    <p className="text-xs text-muted-foreground">Book a demo or consultation</p>
                  </div>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Follow Us</CardTitle>
                <CardDescription>
                  Stay updated on social media
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {socialLinks.map((social) => (
                    <Button
                      key={social.label}
                      variant="outline"
                      className="gap-2"
                      onClick={() => window.open(social.href, '_blank')}
                    >
                      <social.icon className="h-4 w-4" />
                      {social.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Global Offices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">🇺🇸 San Francisco</h4>
                  <p className="text-sm text-muted-foreground">
                    123 Business Street<br />
                    San Francisco, CA 94107<br />
                    United States
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">🇬🇧 London</h4>
                  <p className="text-sm text-muted-foreground">
                    456 Tech Square<br />
                    London EC2A 4NE<br />
                    United Kingdom
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">🇸🇬 Singapore</h4>
                  <p className="text-sm text-muted-foreground">
                    789 Marina View<br />
                    Singapore 018960
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}