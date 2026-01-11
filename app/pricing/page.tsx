'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Check, X, HelpCircle } from 'lucide-react';
import { Switch } from '../../components/ui/switch';
import { Label } from '../../components/ui/label';

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: 'Free',
      price: { monthly: 0, annual: 0 },
      description: 'Perfect for getting started',
      features: [
        '100 messages per month',
        'Basic AI capabilities',
        'Standard response speed',
        'Community support',
        '1 conversation history',
        'Basic analytics',
      ],
      limitations: ['No priority support', 'No custom prompts', 'Limited tokens'],
      buttonText: 'Get Started',
      buttonVariant: 'outline' as const,
    },
    {
      name: 'Pro',
      price: { monthly: 29, annual: 24 },
      description: 'For power users and small teams',
      popular: true,
      features: [
        '5,000 messages per month',
        'Advanced AI capabilities',
        'Faster response speed',
        'Priority support',
        'Unlimited conversation history',
        'Advanced analytics',
        'Custom system prompts',
        'API access',
      ],
      buttonText: 'Start Free Trial',
      buttonVariant: 'default' as const,
    },
    {
      name: 'Enterprise',
      price: { monthly: 99, annual: 79 },
      description: 'For large organizations',
      features: [
        'Unlimited messages',
        'Premium AI capabilities',
        'Fastest response speed',
        '24/7 dedicated support',
        'Custom conversation models',
        'Advanced security',
        'SLA guarantee',
        'Custom integration',
        'Training & onboarding',
      ],
      buttonText: 'Contact Sales',
      buttonVariant: 'outline' as const,
    },
  ];

  const faqs = [
    {
      question: 'Can I switch plans later?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time.',
    },
    {
      question: 'Do you offer custom pricing?',
      answer: 'Yes, for enterprise plans with specific requirements.',
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes, all paid plans come with a 14-day free trial.',
    },
    {
      question: 'How is usage calculated?',
      answer: 'Usage is calculated based on API calls and message count.',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold tracking-tight mb-6">
          Simple,{' '}
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Transparent
          </span>{' '}
          Pricing
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Choose the perfect plan for your needs. All plans include core features.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <Label htmlFor="billing-toggle" className="text-lg font-medium">
            Monthly
          </Label>
          <Switch
            id="billing-toggle"
            checked={isAnnual}
            onCheckedChange={setIsAnnual}
          />
          <div className="flex items-center gap-2">
            <Label htmlFor="billing-toggle" className="text-lg font-medium">
              Annual
            </Label>
            <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
              Save 20%
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-full">
                Most Popular
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">
                  ${isAnnual ? plan.price.annual : plan.price.monthly}
                </span>
                <span className="text-muted-foreground">/month</span>
              </div>
              {isAnnual && plan.price.annual < plan.price.monthly && (
                <p className="text-sm text-green-600">
                  Billed annually (${plan.price.annual * 12}/year)
                </p>
              )}
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
                {plan.limitations?.map((limitation) => (
                  <li key={limitation} className="flex items-start gap-3 text-muted-foreground">
                    <X className="h-5 w-5 flex-shrink-0" />
                    <span>{limitation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant={plan.buttonVariant} size="lg">
                {plan.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Feature Comparison</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 font-semibold">Feature</th>
                    {plans.map((plan) => (
                      <th key={plan.name} className="text-center py-4 font-semibold">
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    'API Access',
                    'Priority Support',
                    'Custom Prompts',
                    'Unlimited History',
                    'Advanced Analytics',
                    'SLA Guarantee',
                    'Custom Models',
                    'Training Sessions',
                  ].map((feature) => (
                    <tr key={feature} className="border-b">
                      <td className="py-4">{feature}</td>
                      {plans.map((plan) => (
                        <td key={`${plan.name}-${feature}`} className="text-center py-4">
                          {plan.features.some(f => f.includes(feature.split(' ')[0])) ||
                          (plan.name === 'Enterprise' && feature !== 'Training Sessions') ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : plan.limitations?.some(l => l.includes(feature)) ? (
                            <X className="h-5 w-5 text-muted-foreground mx-auto" />
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq) => (
            <Card key={faq.question}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  {faq.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Enterprise CTA */}
      <div className="mt-16 text-center">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Need a Custom Solution?</CardTitle>
            <CardDescription>
              Contact our sales team for enterprise pricing and custom integrations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold">For Teams</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Volume discounts</li>
                  <li>• Team management</li>
                  <li>• Centralized billing</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">For Enterprises</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Custom AI models</li>
                  <li>• On-premise deployment</li>
                  <li>• Dedicated support</li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button size="lg" className="w-full">
              Schedule a Demo
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}