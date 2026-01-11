// app/auth/verify-email/page.tsx
'use client';

import { Suspense } from 'react';
import VerifyEmailContent from './verifyemailcontent';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <VerifyEmailContent />
    </Suspense>
  );
}

function LoadingSkeleton() {
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