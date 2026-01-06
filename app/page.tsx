import ChatContainer from '@/components/ChatInterface';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Zap, Shield, Globe } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: <Zap className="h-5 w-5" />,
      title: 'Real-time Streaming',
      description: 'Responses stream token-by-token for natural conversation flow',
    },
    {
      icon: <Brain className="h-5 w-5" />,
      title: 'Advanced AI',
      description: 'Powered by Grok with wit, humor, and deep reasoning',
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: 'Secure & Private',
      description: 'Your conversations are processed securely',
    },
    {
      icon: <Globe className="h-5 w-5" />,
      title: 'Modern Interface',
      description: 'Clean, responsive design with smooth animations',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Grok AI Chatbot
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A full-stack AI assistant built with Next.js, TypeScript, and xAI's Grok API.
            Experience intelligent conversations with modern, professional design.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="p-2 bg-primary/10 rounded-lg w-fit">
                  <div className="text-primary">{feature.icon}</div>
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mb-12">
          <ChatContainer />
        </div>

        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-center">Getting Started</CardTitle>
            <CardDescription className="text-center">
              Follow these steps to run the chatbot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-primary mb-2">1</div>
                <h3 className="font-semibold mb-2">Get API Key</h3>
                <p className="text-sm text-muted-foreground">
                  Sign up at x.ai/api and get your free API key
                </p>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-primary mb-2">2</div>
                <h3 className="font-semibold mb-2">Configure</h3>
                <p className="text-sm text-muted-foreground">
                  Add your API key to the .env.local file
                </p>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-primary mb-2">3</div>
                <h3 className="font-semibold mb-2">Start Chatting</h3>
                <p className="text-sm text-muted-foreground">
                  Run the development server and begin your conversation
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}