// app/auth/verify-email/VerifyEmailContent.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Button } from '../../../components/ui/button';
import { CheckCircle, XCircle, LogIn, Home } from 'lucide-react';

export default function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const success = searchParams.get('success');
    const error = searchParams.get('error');
    const token = searchParams.get('token');
    
    if (success === 'true') {
      setStatus('success');
      setMessage('Your email has been verified successfully! You can now login to your account.');
    } else if (error) {
      setStatus('error');
      switch(error) {
        case 'invalid-token':
          setMessage('The verification link is invalid or has expired. Please try registering again.');
          break;
        case 'no-token':
          setMessage('Invalid verification link. No token provided.');
          break;
        default:
          setMessage('An error occurred during verification. Please try again.');
      }
    } else if (token) {
      // If there's a token in URL, redirect to API to verify it
      window.location.href = `/api/auth/verify-email?token=${token}`;
    } else {
      // No parameters, show error
      setStatus('error');
      setMessage('Invalid verification link.');
    }
  }, [searchParams]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
            </div>
            <CardTitle className="text-2xl">Verifying Email</CardTitle>
            <CardDescription>
              Please wait while we verify your email address
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">Processing verification...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
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
              <AlertDescription>{message}</AlertDescription>
            </Alert>

            <div className="space-y-3">
              {status === 'success' ? (
                <>
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
                </>
              ) : (
                <>
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
                </>
              )}
            </div>

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