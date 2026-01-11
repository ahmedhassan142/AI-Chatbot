// app/auth/register/verification-pending/page.tsx
'use client';

import { Suspense } from 'react';
import VerificationPendingContent from './Verificationpendingcontent';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Mail, Clock } from 'lucide-react';

export default function VerificationPendingPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <VerificationPendingContent />
    </Suspense>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 backdrop-blur-sm bg-card/95">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 animate-pulse">
              <Mail className="h-8 w-8 text-primary/30" />
            </div>
            <CardTitle className="text-2xl">Loading...</CardTitle>
            <CardDescription>
              Please wait while we prepare your verification page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="rounded-lg border bg-muted/50 p-4 animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}