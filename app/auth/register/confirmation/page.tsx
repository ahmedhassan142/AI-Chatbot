// app/auth/register/confirmation/page.tsx
'use client';

import { Suspense } from 'react';
import ConfirmationContent from './confirmationcontent';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ConfirmationContent />
    </Suspense>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 backdrop-blur-sm bg-card/95">
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
    </div>
  );
}