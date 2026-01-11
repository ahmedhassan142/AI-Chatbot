// components/AuthGuard.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = sessionStorage.getItem('accessToken');
    const userData = sessionStorage.getItem('userData');
    
    console.log('🔍 AuthGuard checking:', { token, userData });
    
    if (!token || !userData) {
      console.log('❌ No auth data, redirecting to login');
      router.push('/auth/login');
      return;
    }
    
    try {
      const user = JSON.parse(userData);
      
      // Additional check: ensure email is verified
      if (!user.emailVerified) {
        console.log('❌ Email not verified, redirecting to login');
        sessionStorage.clear();
        router.push('/auth/login');
        return;
      }
      
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to parse user data:', error);
      sessionStorage.clear();
      router.push('/auth/login');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-4 text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-4 text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}