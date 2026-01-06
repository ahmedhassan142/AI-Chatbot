import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Users, Target, Rocket, Globe, Shield } from 'lucide-react';

export default function AboutPage() {
  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: 'Advanced AI',
      description: 'Powered by xAI\'s Grok, our chatbot delivers intelligent, nuanced conversations.',
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: 'Precision',
      description: 'Accurate responses tailored to your specific questions and context.',
    },
    {
      icon: <Rocket className="h-8 w-8" />,
      title: 'Speed',
      description: 'Lightning-fast responses with real-time streaming capabilities.',
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Security',
      description: 'Enterprise-grade security protecting your data and conversations.',
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: 'Global',
      description: 'Support for multiple languages and accessibility features.',
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Community',
      description: 'Join thousands of developers and businesses using our platform.',
    },
  ];

  const team = [
    {
      name: 'Alex Johnson',
      role: 'Lead Developer',
      bio: '10+ years in AI and ML development',
      image: '/images/team/alex.jpg',
    },
    {
      name: 'Sarah Chen',
      role: 'UX Designer',
      bio: 'Specializes in conversational interfaces',
      image: '/images/team/sarah.jpg',
    },
    {
      name: 'Mike Wilson',
      role: 'DevOps Engineer',
      bio: 'Cloud infrastructure and scaling expert',
      image: '/images/team/mike.jpg',
    },
    {
      name: 'Emma Davis',
      role: 'Product Manager',
      bio: 'AI product strategy and roadmap',
      image: '/images/team/emma.jpg',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold tracking-tight mb-6">
          About{' '}
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Grok AI Chatbot
          </span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          We're building the future of human-AI interaction, one conversation at a time.
        </p>
        <Button size="lg">Get Started</Button>
      </div>

      {/* Mission */}
      <Card className="mb-16">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl mb-4">Our Mission</CardTitle>
          <CardDescription className="text-lg">
            To make AI accessible, useful, and delightful for everyone. We believe in creating
            AI assistants that understand context, show empathy, and provide real value.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Features */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Grok AI</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary">
                    {feature.icon}
                  </div>
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member) => (
            <Card key={member.name} className="text-center">
              <CardContent className="pt-6">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {member.name.charAt(0)}
                </div>
                <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                <p className="text-primary mb-2">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats */}
      <Card className="mb-16">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">10K+</div>
              <p className="text-muted-foreground">Active Users</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">1M+</div>
              <p className="text-muted-foreground">Conversations</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">99.9%</div>
              <p className="text-muted-foreground">Uptime</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">50+</div>
              <p className="text-muted-foreground">Countries</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Conversations?</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of users who are already experiencing the power of intelligent AI conversations.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg">Start Free Trial</Button>
          <Button variant="outline" size="lg">
            Contact Sales
          </Button>
        </div>
      </div>
    </div>
  );
}