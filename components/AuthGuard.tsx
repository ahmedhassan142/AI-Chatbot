'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = sessionStorage.getItem('accessToken');
        
        if (!token) {
          router.push('/auth/login');
          return;
        }

        // Verify token with server
        const response = await fetch('/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          // Try to refresh token
          const refreshResponse = await fetch('/api/auth/refresh', {
            method: 'POST',
          });

          if (refreshResponse.ok) {
            const { accessToken } = await refreshResponse.json();
            sessionStorage.setItem('accessToken', accessToken);
            setIsAuthenticated(true);
          } else {
            sessionStorage.removeItem('accessToken');
            router.push('/auth/login');
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        sessionStorage.removeItem('accessToken');
        router.push('/auth/login');
      }
    };

    checkAuth();
  }, [router]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}