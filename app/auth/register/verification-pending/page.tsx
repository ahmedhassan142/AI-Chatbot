'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, CheckCircle, Clock, RefreshCw } from 'lucide-react';

export default function VerificationPendingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || 'your email';
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleResendEmail = async () => {
    if (!canResend) return;

    try {
      // Call API to resend verification email
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setCountdown(60);
        setCanResend(false);
        alert('Verification email has been resent!');
      }
    } catch (error) {
      console.error('Failed to resend email:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 backdrop-blur-sm bg-card/95">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
            <CardDescription>
              We've sent a verification link to your email address
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="rounded-lg border bg-muted/50 p-4">
                <p className="text-center font-medium text-sm">
                  {decodeURIComponent(email)}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Check your inbox for the verification email</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span>Click the link in the email to verify your account</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Complete your account setup and start using the platform</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-center text-sm text-muted-foreground">
                <p>Didn't receive the email?</p>
                <div className="mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResendEmail}
                    disabled={!canResend}
                    className="gap-2"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Resend Email {!canResend && `(${countdown}s)`}
                  </Button>
                </div>
              </div>

              <div className="text-center text-xs text-muted-foreground">
                <p>Make sure to check your spam folder if you don't see the email.</p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/auth/login')}
                >
                  Return to Login
                </Button>
                <div className="text-center text-sm">
                  Need help?{' '}
                  <Link href="/support" className="text-primary hover:underline">
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}