// app/auth/register/confirmation/ConfirmationContent.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertCircle, Home, LogIn } from 'lucide-react';

export default function ConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const success = searchParams.get('success');
    
    if (success === 'true') {
      setStatus('success');
      setMessage('Your email has been verified successfully! You can now login to your account.');
    } else if (success === 'false') {
      setStatus('error');
      setMessage('The verification link is invalid or has expired. Please try registering again.');
    } else if (token) {
      // If there's a token, try to verify it
      verifyToken(token);
    } else {
      router.push('/auth/login');
    }
  }, [searchParams, router]);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch(`/api/auth/verify-email?token=${token}`);
      
      if (response.ok) {
        setStatus('success');
        setMessage('Your email has been verified successfully! You can now login to your account.');
      } else {
        setStatus('error');
        setMessage('The verification link is invalid or has expired. Please try registering again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred during verification. Please try again.');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-4 text-muted-foreground">Verifying your email...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 backdrop-blur-sm bg-card/95">
          <CardHeader className="text-center">
            <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
              status === 'success' ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {status === 'success' ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <XCircle className="h-8 w-8 text-red-600" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {status === 'success' ? 'Email Verified!' : 'Verification Failed'}
            </CardTitle>
            <CardDescription>
              {status === 'success' 
                ? 'Your account is now fully activated'
                : 'We could not verify your email address'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert variant={status === 'success' ? 'default' : 'destructive'}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>

            {status === 'success' ? (
              <div className="space-y-4">
                <div className="space-y-2 text-sm">
                  <p className="font-medium">You can now:</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Login to your account</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Access all features</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Complete your profile</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full gap-2"
                    onClick={() => router.push('/auth/login')}
                  >
                    <LogIn className="h-4 w-4" />
                    Go to Login
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push('/')}
                  >
                    Back to Homepage
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2 text-sm">
                  <p className="font-medium">Possible reasons:</p>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>The verification link has expired</li>
                    <li>The link was already used</li>
                    <li>There was an error processing your request</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full"
                    onClick={() => router.push('/auth/register')}
                  >
                    Register Again
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push('/auth/login')}
                  >
                    Go to Login
                  </Button>
                  <div className="text-center text-sm">
                    Need help?{' '}
                    <Link href="/support" className="text-primary hover:underline">
                      Contact Support
                    </Link>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t">
              <Button
                variant="ghost"
                className="w-full gap-2"
                onClick={() => router.push('/')}
              >
                <Home className="h-4 w-4" />
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}